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

// Minden admin route-hoz kell autentikáció + admin jogosultság
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Felhasználók
router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/role', updateUserRole);

// Hirdetések
router.get('/items', getAllItemsAdmin);
router.delete('/items/:itemId', deleteItemAdmin);
router.put('/items/:itemId/status', updateItemStatusAdmin);

// Bejelentések
router.get('/reports', getAllReports);
router.put('/reports/:reportId/status', updateReportStatus);

// Rendelések
router.get('/orders', getAllOrdersAdmin);
router.put('/orders/:orderId/status', updateOrderStatusAdmin);
router.delete('/orders/:orderId', deleteOrderAdmin);

export default router;
