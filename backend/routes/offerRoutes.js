import express from 'express';
import { 
  createOffer, 
  getOffersByItem, 
  acceptOffer,
  rejectOffer,
  counterOffer,
  acceptCounterOffer,
  deleteOffer,
  getUnreadOfferCount
} from '../controllers/offerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createOffer);
router.get('/item/:itemId', authenticateToken, getOffersByItem);
router.get('/unread-count', authenticateToken, getUnreadOfferCount);
router.put('/:offerId/accept', authenticateToken, acceptOffer);
router.put('/:offerId/reject', authenticateToken, rejectOffer);
router.put('/:offerId/counter', authenticateToken, counterOffer);
router.put('/:offerId/accept-counter', authenticateToken, acceptCounterOffer);
router.delete('/:offerId', authenticateToken, deleteOffer);

export default router;
