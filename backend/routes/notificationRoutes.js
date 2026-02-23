import express from 'express';
import { getNotifications, getNotificationCount } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.get('/count', authMiddleware, getNotificationCount);

export default router;
