import {
  createDraftComplaint,
  updateDraftComplaint,
  submitComplaint,
  getCitizenComplaints,
  getComplaintById,
  getComplaintTimeline,
} from '../services/complaintService.js';
import { ValidationError } from '../utils/errors.js';

export const createDraftHandler = async (req, res, next) => {
  try {
    const {
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
    } = req.body;

    if (!originalStatement || originalStatement.trim().length < 5) {
      throw new ValidationError('Original statement must be at least 5 characters.');
    }

    const complaint = await createDraftComplaint({
      userId: req.user._id,
      originalStatement: originalStatement.trim(),
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
    });

    res.status(201).json({
      success: true,
      message: 'Draft complaint created successfully',
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const updateDraftHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await updateDraftComplaint(id, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: 'Draft complaint updated successfully',
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const submitComplaintHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await submitComplaint(id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Complaint submitted and routed successfully',
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const getCitizenComplaintsHandler = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await getCitizenComplaints(req.user._id, { status, page, limit });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await getComplaintById(id, req.user);

    res.status(200).json({
      success: true,
      data: { complaint },
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintTimelineHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const timeline = await getComplaintTimeline(id, req.user);

    res.status(200).json({
      success: true,
      data: { timeline },
    });
  } catch (error) {
    next(error);
  }
};
