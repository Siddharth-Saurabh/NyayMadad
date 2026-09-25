import { Router } from 'express';
import {
  createDraftHandler,
  updateDraftHandler,
  submitComplaintHandler,
  getCitizenComplaintsHandler,
  getComplaintByIdHandler,
  getComplaintTimelineHandler,
} from '../controllers/complaintController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, createDraftHandler);
router.get('/', authMiddleware, getCitizenComplaintsHandler);
router.get('/:id', authMiddleware, getComplaintByIdHandler);
router.put('/:id', authMiddleware, updateDraftHandler);
router.post('/:id/submit', authMiddleware, submitComplaintHandler);
router.get('/:id/timeline', authMiddleware, getComplaintTimelineHandler);

export default router;
