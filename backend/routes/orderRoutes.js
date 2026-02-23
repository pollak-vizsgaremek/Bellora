import express from 'express';
import { createOrder, getMyOrders, getMySales, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/my-sales', authenticateToken, getMySales);
router.put('/:id/status', authenticateToken, updateOrderStatus);

export default router;
