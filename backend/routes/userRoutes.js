import express from 'express';
import { 
  getUserById, 
  getUserItems,
  uploadProfileImage,
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/:userId', getUserById);
router.get('/:userId/items', getUserItems);
router.post('/profile-image', authenticateToken, upload.single('profile_image'), uploadProfileImage);
router.put('/profile', authenticateToken, updateProfile);
router.put('/password', authenticateToken, changePassword);
router.delete('/account', authenticateToken, deleteAccount);

export default router;
