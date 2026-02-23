import express from 'express';
import { getMessages, sendMessage, getConversations } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', authenticateToken, getConversations);
router.get('/:userId', authenticateToken, getMessages);
router.post('/', authenticateToken, sendMessage);

export default router;
