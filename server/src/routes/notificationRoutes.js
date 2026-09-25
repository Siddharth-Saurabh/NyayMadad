import { Router } from 'express';
import {
  getNotificationsHandler,
  markNotificationReadHandler,
  markAllNotificationsReadHandler,
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getNotificationsHandler);
router.patch('/:id/read', markNotificationReadHandler);
router.patch('/read-all', markAllNotificationsReadHandler);

export default router;
