import { Router } from 'express';
import salesReportController from '../controllers/salesReport';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

// All sales report routes require admin authentication
router.use(authenticate, isAdmin);

// Route for category-wise sales
router.get('/category-wise', salesReportController.getCategorySales);

// Route for top-selling products
router.get('/top-selling', salesReportController.getTopSellingProducts);

// Route for worst-selling products
router.get('/worst-selling', salesReportController.getWorstSellingProducts);

export default router;