import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllItemsAdmin,
  deleteItemAdmin,
  updateItemStatusAdmin,
  getAllReports,
  updateReportStatus,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
  getDashboardStats
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', getDashboardStats);

router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/role', updateUserRole);

router.get('/items', getAllItemsAdmin);
router.delete('/items/:itemId', deleteItemAdmin);
router.put('/items/:itemId/status', updateItemStatusAdmin);

router.get('/reports', getAllReports);
router.put('/reports/:reportId/status', updateReportStatus);

router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:orderId/status', updateOrderStatusAdmin);
router.delete('/orders/:orderId', deleteOrderAdmin);

export default router;
