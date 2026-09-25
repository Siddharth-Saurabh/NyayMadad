import { InformationRequest } from '../models/InformationRequest.js';
import { Complaint } from '../models/Complaint.js';
import { StatusHistory } from '../models/StatusHistory.js';
import { AuditLog } from '../models/AuditLog.js';
import { Notification } from '../models/Notification.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors.js';

export const getComplaintInfoRequests = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new NotFoundError('Complaint');

    if (req.user.role === 'citizen' && complaint.userId.toString() !== req.user._id.toString()) {
      throw new AuthorizationError('Access denied.');
    }

    const requests = await InformationRequest.find({ complaintId })
      .populate('requestedBy', 'name role')
      .populate('evidenceIds')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { infoRequests: requests },
    });
  } catch (error) {
    next(error);
  }
};

export const respondToInfoRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { response, evidenceIds } = req.body;

    if (!response || response.trim().length < 3) {
      throw new ValidationError('Response must be at least 3 characters.');
    }

    const infoReq = await InformationRequest.findById(requestId);
    if (!infoReq) throw new NotFoundError('Information Request');

    const complaint = await Complaint.findById(infoReq.complaintId);
    if (!complaint) throw new NotFoundError('Complaint');

    if (req.user.role === 'citizen' && complaint.userId.toString() !== req.user._id.toString()) {
      throw new AuthorizationError('Only the complaint owner can respond.');
    }

    infoReq.response = response.trim();
    infoReq.status = 'RESPONDED';
    infoReq.respondedAt = new Date();
    if (evidenceIds && Array.isArray(evidenceIds)) {
      infoReq.evidenceIds = evidenceIds;
    }
    await infoReq.save();

    // Move complaint status back to UNDER_REVIEW
    complaint.status = 'UNDER_REVIEW';
    await complaint.save();

    await StatusHistory.create({
      complaintId: complaint._id,
      fromStatus: 'INFORMATION_REQUESTED',
      toStatus: 'UNDER_REVIEW',
      changedBy: req.user._id,
      actorRole: 'citizen',
      note: `Citizen submitted response to official information request.`,
    });

    await AuditLog.create({
      actorId: req.user._id,
      actorRole: req.user.role,
      action: 'INFORMATION_RESPONDED',
      resourceType: 'InformationRequest',
      resourceId: infoReq._id.toString(),
      metadata: { complaintId: complaint._id.toString() },
    });

    res.status(200).json({
      success: true,
      message: 'Response submitted successfully. Case updated for review.',
      data: { infoRequest: infoReq },
    });
  } catch (error) {
    next(error);
  }
};
