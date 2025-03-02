import express from 'express';
import { 
  getAllCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryWithProducts
} from '../controllers/category';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/:id/products', getCategoryWithProducts);

export default router;
