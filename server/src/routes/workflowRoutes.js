import { Router } from 'express';
import { getComplaintInfoRequests, respondToInfoRequest } from '../controllers/workflowController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/complaints/:complaintId/info-requests', authMiddleware, getComplaintInfoRequests);
router.post('/info-requests/:requestId/respond', authMiddleware, respondToInfoRequest);

export default router;
