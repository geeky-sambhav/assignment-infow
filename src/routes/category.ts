import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithProducts,
} from '../controllers/category';

const router = Router();

// User routes - need authentication
router.get('/', authenticate, getAllCategories);
router.get('/:id', authenticate, getCategory);
router.get('/:id/products', authenticate, getCategoryWithProducts);

// Admin routes - need admin privileges
router.post('/', authenticate, isAdmin, createCategory);
router.put('/:id', authenticate, isAdmin, updateCategory);
router.delete('/:id', authenticate, isAdmin, deleteCategory);

export default router;