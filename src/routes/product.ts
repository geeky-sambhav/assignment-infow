import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  getProductBySlug
} from '../controllers/product';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', authenticate, getAllProducts);
router.get('/:id',authenticate, getProduct);
router.get('/by-slug/:slug',authenticate, getProductBySlug);

// Admin routes - protected
router.post('/', authenticate, isAdmin, createProduct);
router.put('/:id', authenticate, isAdmin, updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;