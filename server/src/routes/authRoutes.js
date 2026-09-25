import { Router } from 'express';
import { getMe, syncUser, switchDemoPersona } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.post('/sync', syncUser);
router.post('/demo-switch', switchDemoPersona);

export default router;
