import { Router } from 'express';
import {
  uploadEvidenceHandler,
  getEvidenceListHandler,
  downloadEvidenceFileHandler,
  evidenceUploadMiddleware,
} from '../controllers/evidenceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Sub-routes under complaints
router.post('/complaints/:complaintId/evidence', authMiddleware, evidenceUploadMiddleware, uploadEvidenceHandler);
router.get('/complaints/:complaintId/evidence', authMiddleware, getEvidenceListHandler);

// Direct protected access for individual evidence item
router.get('/evidence/:id', authMiddleware, downloadEvidenceFileHandler);

export default router;
