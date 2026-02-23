import express from 'express';
import { getNotifications, getNotificationCount } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.get('/count', authenticateToken, getNotificationCount);

export default router;
