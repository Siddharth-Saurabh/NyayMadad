import { Router } from 'express';
import {
  analyzeTextHandler,
  generateQuestionsHandler,
  generateComplaintDraftHandler,
  transcribeAudioHandler,
  audioUploadMiddleware,
} from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/analyze', authMiddleware, analyzeTextHandler);
router.post('/questions', authMiddleware, generateQuestionsHandler);
router.post('/generate-complaint', authMiddleware, generateComplaintDraftHandler);
router.post('/transcribe', authMiddleware, audioUploadMiddleware, transcribeAudioHandler);

export default router;
