import { Complaint } from '../models/Complaint.js';
import { Department } from '../models/Department.js';
import { Officer } from '../models/Officer.js';
import { StatusHistory } from '../models/StatusHistory.js';
import { InformationRequest } from '../models/InformationRequest.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';
import { validateStatusTransition } from '../utils/statusStateMachine.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors.js';

export const getAuthorityMetrics = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'officer' && req.user.departmentId) {
      filter.assignedDepartment = req.user.departmentId;
    } else if (req.user.role === 'department_admin' && req.user.departmentId) {
      filter.assignedDepartment = req.user.departmentId;
    }

    const [
      total,
      underReview,
      infoRequested,
      assigned,
      investigation,
      resolved,
      emergencyCount,
    ] = await Promise.all([
      Complaint.countDocuments(filter),
      Complaint.countDocuments({ ...filter, status: 'UNDER_REVIEW' }),
      Complaint.countDocuments({ ...filter, status: 'INFORMATION_REQUESTED' }),
      Complaint.countDocuments({ ...filter, status: 'ASSIGNED' }),
      Complaint.countDocuments({ ...filter, status: { $in: ['PROCESSING', 'INVESTIGATION'] } }),
      Complaint.countDocuments({ ...filter, status: { $in: ['RESOLVED', 'CLOSED'] } }),
      Complaint.countDocuments({ ...filter, urgency: 'Emergency' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          total,
          underReview,
          infoRequested,
          assigned,
          investigation,
          resolved,
          emergencyCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthorityComplaints = async (req, res, next) => {
  try {
    const { status, category, urgency, search, page = 1, limit = 15 } = req.query;

    const query = {};

    // Filter by department access
    if (req.user.role === 'officer' || req.user.role === 'department_admin') {
      if (req.user.departmentId) {
        query.assignedDepartment = req.user.departmentId;
      }
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (urgency && urgency !== 'ALL') {
      query.urgency = urgency;
    }

    if (search) {
      query.$or = [
        { complaintNumber: { $regex: search, $options: 'i' } },
        { originalStatement: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('assignedDepartment', 'name code jurisdiction')
        .populate('assignedOfficer', 'name badgeNumber rank')
        .populate('userId', 'name email phone')
        .sort({ urgency: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Complaint.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        complaints,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatusHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus, note, resolutionSummary } = req.body;

    if (!newStatus) {
      throw new ValidationError('New status is required');
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      throw new NotFoundError('Complaint');
    }

    // Validate transition
    validateStatusTransition(complaint.status, newStatus, req.user.role);

    const fromStatus = complaint.status;
    complaint.status = newStatus;

    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      complaint.resolvedAt = new Date();
      if (resolutionSummary) complaint.resolutionSummary = resolutionSummary;
    }

    await complaint.save();

    // Log status transition history
    await StatusHistory.create({
      complaintId: complaint._id,
      fromStatus,
      toStatus: newStatus,
      changedBy: req.user._id,
      actorRole: req.user.role,
      note: note || `Status officially transitioned from ${fromStatus} to ${newStatus}`,
    });

    // Create Audit Log
    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'STATUS_CHANGED',
      resourceType: 'Complaint',
      resourceId: complaint._id.toString(),
      metadata: { fromStatus, toStatus: newStatus, note },
    });

    // Notify citizen
    await Notification.create({
      userId: complaint.userId,
      complaintId: complaint._id,
      title: `Status Update: ${complaint.complaintNumber}`,
      message: `Your case status has changed to ${newStatus.replace('_', ' ')}. ${note ? `Note: ${note}` : ''}`,
      type: newStatus === 'RESOLVED' ? 'COMPLAINT_RESOLVED' : 'STATUS_UPDATED',
    });

    res.status(200).json({
      success: true,
      message: `Status transitioned to ${newStatus}`,
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const assignOfficerHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { officerId, note } = req.body;

    if (!officerId) {
      throw new ValidationError('Officer ID is required');
    }

    const [complaint, officer] = await Promise.all([
      Complaint.findById(id),
      Officer.findById(officerId),
    ]);

    if (!complaint) throw new NotFoundError('Complaint');
    if (!officer) throw new NotFoundError('Officer');

    complaint.assignedOfficer = officer._id;
    if (['ROUTED', 'RECEIVED', 'UNDER_REVIEW'].includes(complaint.status)) {
      complaint.status = 'ASSIGNED';
    }
    await complaint.save();

    await StatusHistory.create({
      complaintId: complaint._id,
      fromStatus: complaint.status,
      toStatus: complaint.status,
      changedBy: req.user._id,
      actorRole: req.user.role,
      note: `Assigned to ${officer.name} (${officer.badgeNumber}). ${note || ''}`,
    });

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'OFFICER_ASSIGNED',
      resourceType: 'Complaint',
      resourceId: complaint._id.toString(),
      metadata: { officerId: officer._id.toString(), officerName: officer.name },
    });

    await Notification.create({
      userId: complaint.userId,
      complaintId: complaint._id,
      title: `Officer Assigned: ${complaint.complaintNumber}`,
      message: `Investigating Officer ${officer.name} has been assigned to your case.`,
      type: 'OFFICER_ASSIGNED',
    });

    res.status(200).json({
      success: true,
      message: `Officer ${officer.name} assigned successfully`,
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const transferComplaintHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetDepartmentId, reason } = req.body;

    if (!targetDepartmentId || !reason) {
      throw new ValidationError('Target department and transfer reason are mandatory.');
    }

    const [complaint, targetDept] = await Promise.all([
      Complaint.findById(id),
      Department.findById(targetDepartmentId),
    ]);

    if (!complaint) throw new NotFoundError('Complaint');
    if (!targetDept) throw new NotFoundError('Target Department');

    const previousDeptId = complaint.assignedDepartment;
    complaint.assignedDepartment = targetDept._id;
    complaint.assignedOfficer = null;
    complaint.status = 'TRANSFERRED';
    await complaint.save();

    await StatusHistory.create({
      complaintId: complaint._id,
      fromStatus: 'UNDER_REVIEW',
      toStatus: 'TRANSFERRED',
      changedBy: req.user._id,
      actorRole: req.user.role,
      note: `Transferred to ${targetDept.name}. Reason: ${reason}`,
    });

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'CASE_TRANSFERRED',
      resourceType: 'Complaint',
      resourceId: complaint._id.toString(),
      metadata: { previousDeptId, newDeptId: targetDept._id.toString(), reason },
    });

    res.status(200).json({
      success: true,
      message: `Case successfully transferred to ${targetDept.name}`,
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const requestInfoHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!question || question.trim().length < 5) {
      throw new ValidationError('Clarification question must be at least 5 characters.');
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) throw new NotFoundError('Complaint');

    const infoReq = await InformationRequest.create({
      complaintId: complaint._id,
      requestedBy: req.user._id,
      officerName: req.user.name,
      question: question.trim(),
      status: 'PENDING',
    });

    complaint.status = 'INFORMATION_REQUESTED';
    await complaint.save();

    await StatusHistory.create({
      complaintId: complaint._id,
      fromStatus: complaint.status,
      toStatus: 'INFORMATION_REQUESTED',
      changedBy: req.user._id,
      actorRole: req.user.role,
      note: `Official information requested from citizen: "${question}"`,
    });

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'INFORMATION_REQUESTED',
      resourceType: 'InformationRequest',
      resourceId: infoReq._id.toString(),
      metadata: { complaintId: complaint._id.toString(), question },
    });

    await Notification.create({
      userId: complaint.userId,
      complaintId: complaint._id,
      title: `Action Required: Info Requested for ${complaint.complaintNumber}`,
      message: `The investigating authority requested additional clarification: "${question}"`,
      type: 'INFORMATION_REQUESTED',
    });

    res.status(201).json({
      success: true,
      message: 'Information request sent to citizen',
      data: { infoRequest: infoReq },
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentOfficers = async (req, res, next) => {
  try {
    const filter = { active: true };
    if (req.user.departmentId && req.user.role !== 'system_admin') {
      filter.departmentId = req.user.departmentId;
    }
    const officers = await Officer.find(filter).populate('departmentId', 'name code');
    res.status(200).json({
      success: true,
      data: { officers },
    });
  } catch (error) {
    next(error);
  }
};
