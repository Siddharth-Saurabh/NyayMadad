import { Router } from 'express';
import {
  getAuthorityMetrics,
  getAuthorityComplaints,
  updateComplaintStatusHandler,
  assignOfficerHandler,
  transferComplaintHandler,
  requestInfoHandler,
  getDepartmentOfficers,
} from '../controllers/authorityController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

// Protect all authority routes
router.use(authMiddleware);
router.use(requireRole('officer', 'department_admin', 'system_admin'));

router.get('/metrics', getAuthorityMetrics);
router.get('/complaints', getAuthorityComplaints);
router.get('/officers', getDepartmentOfficers);
router.patch('/complaints/:id/status', updateComplaintStatusHandler);
router.post('/complaints/:id/assign', assignOfficerHandler);
router.post('/complaints/:id/transfer', transferComplaintHandler);
router.post('/complaints/:id/request-info', requestInfoHandler);

export default router;
