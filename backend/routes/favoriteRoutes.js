import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getFavorites);
router.post('/', authenticateToken, addFavorite);
router.delete('/:itemId', authenticateToken, removeFavorite);

export default router;
