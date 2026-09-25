import multer from 'multer';
import { analyzeIncident, generateQuestions, generateComplaintDraft } from '../services/aiService.js';
import { transcribeAudio } from '../services/speechService.js';
import { ValidationError } from '../utils/errors.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max audio
});

export const audioUploadMiddleware = upload.single('audio');

export const analyzeTextHandler = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length < 5) {
      throw new ValidationError('Please provide a descriptive incident statement (minimum 5 characters).');
    }

    const analysis = await analyzeIncident(text.trim());
    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const generateQuestionsHandler = async (req, res, next) => {
  try {
    const { text, missingFields } = req.body;
    if (!text) {
      throw new ValidationError('Incident text is required to generate follow-up questions.');
    }

    const questions = await generateQuestions(text, missingFields || []);
    res.status(200).json({
      success: true,
      data: { questions },
    });
  } catch (error) {
    next(error);
  }
};

export const generateComplaintDraftHandler = async (req, res, next) => {
  try {
    const { incidentData } = req.body;
    if (!incidentData || !incidentData.originalStatement) {
      throw new ValidationError('Incident data with originalStatement is required.');
    }

    const complaintDraft = await generateComplaintDraft(incidentData);
    res.status(200).json({
      success: true,
      data: { complaintDraft },
    });
  } catch (error) {
    next(error);
  }
};

export const transcribeAudioHandler = async (req, res, next) => {
  try {
    let buffer = null;
    let mimeType = 'audio/webm';

    if (req.file) {
      buffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body.audioBase64) {
      buffer = Buffer.from(req.body.audioBase64, 'base64');
      mimeType = req.body.mimeType || 'audio/webm';
    } else {
      // In dev / mock mode, if no audio is sent, produce mock transcript
      buffer = Buffer.from('mock_audio');
    }

    const result = await transcribeAudio(buffer, mimeType);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
