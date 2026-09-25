import { Router } from 'express';
import {
  getRoutingRules,
  createRoutingRule,
  updateRoutingRule,
  deleteRoutingRule,
  getAuditLogs,
  getAllDepartments,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.use(authMiddleware);

// Department directory (accessible by department_admin and system_admin)
router.get('/departments', requireRole('department_admin', 'system_admin'), getAllDepartments);

// Routing rules & Audit logs (system_admin)
router.get('/routing-rules', requireRole('department_admin', 'system_admin'), getRoutingRules);
router.post('/routing-rules', requireRole('system_admin'), createRoutingRule);
router.put('/routing-rules/:id', requireRole('system_admin'), updateRoutingRule);
router.delete('/routing-rules/:id', requireRole('system_admin'), deleteRoutingRule);

router.get('/audit-logs', requireRole('system_admin'), getAuditLogs);

export default router;
