import { Complaint } from '../models/Complaint.js';
import { StatusHistory } from '../models/StatusHistory.js';
import { Notification } from '../models/Notification.js';
import { routeIncident } from './routingService.js';
import { validateStatusTransition } from '../utils/statusStateMachine.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

// Generate unique sequential / random reference number
const generateComplaintNumber = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `NYAY-${year}-${randomSuffix}`;
};

export const createDraftComplaint = async ({
  userId,
  originalStatement,
  reportingMode = 'TEXT',
  audioMetadata = null,
  category = 'Uncategorized',
  subcategory = null,
  urgency = 'Medium',
  requiresEmergencyResponse = false,
  extractedInformation = {},
  missingInformation = [],
  aiConfidence = 1.0,
  aiGeneratedComplaint = '',
}) => {
  let complaintNumber = generateComplaintNumber();
  
  // Ensure uniqueness
  while (await Complaint.findOne({ complaintNumber })) {
    complaintNumber = generateComplaintNumber();
  }

  const complaint = await Complaint.create({
    complaintNumber,
    userId,
    originalStatement,
    reportingMode,
    audioMetadata,
    category,
    subcategory,
    urgency,
    requiresEmergencyResponse,
    extractedInformation,
    missingInformation,
    aiConfidence,
    aiGeneratedComplaint,
    citizenEditedComplaint: aiGeneratedComplaint || originalStatement,
    status: 'DRAFT',
  });

  await StatusHistory.create({
    complaintId: complaint._id,
    fromStatus: 'INITIAL',
    toStatus: 'DRAFT',
    changedBy: userId,
    actorRole: 'citizen',
    note: 'Initial draft created by citizen.',
  });

  return complaint;
};

export const updateDraftComplaint = async (complaintId, userId, updates) => {
  const complaint = await Complaint.findOne({ _id: complaintId, userId });
  if (!complaint) {
    throw new NotFoundError('Complaint draft');
  }

  if (complaint.status !== 'DRAFT') {
    throw new ValidationError('Only complaints in DRAFT status can be directly modified by citizen.');
  }

  const allowedFields = [
    'originalStatement',
    'citizenEditedComplaint',
    'category',
    'subcategory',
    'incidentDate',
    'incidentTime',
    'incidentLocation',
    'urgency',
    'extractedInformation',
    'missingInformation',
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      complaint[field] = updates[field];
    }
  }

  await complaint.save();
  return complaint;
};

export const submitComplaint = async (complaintId, userId) => {
  const complaint = await Complaint.findOne({ _id: complaintId, userId });
  if (!complaint) {
    throw new NotFoundError('Complaint draft');
  }

  if (complaint.status !== 'DRAFT') {
    throw new ValidationError(`Complaint has already been submitted (Current status: ${complaint.status})`);
  }

  // 1. Transition to SUBMITTED
  validateStatusTransition(complaint.status, 'SUBMITTED', 'citizen');
  complaint.status = 'SUBMITTED';
  complaint.submittedAt = new Date();

  await StatusHistory.create({
    complaintId: complaint._id,
    fromStatus: 'DRAFT',
    toStatus: 'SUBMITTED',
    changedBy: userId,
    actorRole: 'citizen',
    note: 'Complaint officially submitted by citizen.',
  });

  // 2. Execute Deterministic Routing
  const routing = await routeIncident({
    category: complaint.category,
    subcategory: complaint.subcategory,
    location: complaint.incidentLocation,
    urgency: complaint.urgency,
  });

  if (routing.success && routing.departmentId) {
    complaint.status = 'ROUTED';
    complaint.assignedDepartment = routing.departmentId;
    complaint.routingResult = {
      ruleId: routing.ruleId,
      channel: routing.channel,
      routingRationale: routing.routingRationale,
      routedAt: new Date(),
      fallbackUsed: routing.fallbackUsed,
    };

    await StatusHistory.create({
      complaintId: complaint._id,
      fromStatus: 'SUBMITTED',
      toStatus: 'ROUTED',
      actorRole: 'SYSTEM',
      note: `Deterministic engine routed incident to ${routing.departmentName} (${routing.routingRationale})`,
    });
  } else {
    complaint.status = 'ROUTING_FAILED';
    complaint.routingResult = {
      channel: 'MANUAL_QUEUE',
      routingRationale: routing.routingRationale || 'No route match found',
      routedAt: new Date(),
      fallbackUsed: true,
    };

    await StatusHistory.create({
      complaintId: complaint._id,
      fromStatus: 'SUBMITTED',
      toStatus: 'ROUTING_FAILED',
      actorRole: 'SYSTEM',
      note: 'Automatic routing could not determine a department. Queued for manual dispatch.',
    });
  }

  await complaint.save();

  // 3. Create Notification for citizen
  await Notification.create({
    userId,
    complaintId: complaint._id,
    title: `Complaint Submitted: ${complaint.complaintNumber}`,
    message: `Your complaint has been successfully submitted and routed to ${routing.departmentName || 'the review queue'}.`,
    type: 'COMPLAINT_SUBMITTED',
  });

  return complaint;
};

export const getCitizenComplaints = async (userId, { status, page = 1, limit = 10 } = {}) => {
  const query = { userId };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const [complaints, total] = await Promise.all([
    Complaint.find(query)
      .populate('assignedDepartment', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10)),
    Complaint.countDocuments(query),
  ]);

  return {
    complaints,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
    },
  };
};

export const getComplaintById = async (complaintId, user) => {
  const complaint = await Complaint.findById(complaintId)
    .populate('assignedDepartment', 'name code jurisdiction contactEmail contactPhone')
    .populate('assignedOfficer', 'name badgeNumber rank')
    .populate('userId', 'name email phone identityVerified verificationLevel');

  if (!complaint) {
    throw new NotFoundError('Complaint');
  }

  // Authorization check
  if (user.role === 'citizen' && complaint.userId._id.toString() !== user._id.toString()) {
    throw new AuthorizationError('You do not have access to view this complaint.');
  }

  return complaint;
};

export const getComplaintTimeline = async (complaintId, user) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new NotFoundError('Complaint');
  }

  if (user.role === 'citizen' && complaint.userId.toString() !== user._id.toString()) {
    throw new AuthorizationError('Access denied.');
  }

  const timeline = await StatusHistory.find({ complaintId })
    .populate('changedBy', 'name role')
    .sort({ createdAt: 1 });

  return timeline;
};
