import express from 'express';
import { 
  getAllItems, 
  getItemById, 
  createItem, 
  updateItem, 
  deleteItem,
  getMyItems,
  getItemImages,
  uploadItemImages,
  deleteItemImage,
  setPrimaryImage,
  reorderImages
} from '../controllers/itemController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllItems);
router.get('/my-items', authenticateToken, getMyItems);
router.get('/:id', getItemById);
router.post('/', authenticateToken, createItem);
router.put('/:id', authenticateToken, updateItem);
router.delete('/:id', authenticateToken, deleteItem);

router.get('/:id/images', getItemImages);
router.post('/:id/images', authenticateToken, upload.array('images', 10), uploadItemImages);
router.delete('/:id/images/:imageId', authenticateToken, deleteItemImage);
router.put('/:id/images/:imageId/primary', authenticateToken, setPrimaryImage);
router.put('/:id/images/reorder', authenticateToken, reorderImages);

export default router;
