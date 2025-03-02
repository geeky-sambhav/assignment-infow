import express from 'express';
import { authenticate } from '../middleware/auth';
import { placeOrder, getOrderHistory } from '../controllers/order';

const router = express.Router();


router.post('/', authenticate, placeOrder);
router.get('/history', authenticate, getOrderHistory);
export default router;