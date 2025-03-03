import { Router } from 'express';
import salesReportController from '../controllers/salesReport';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CategorySales:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: integer
 *           description: Category ID
 *         categoryName:
 *           type: string
 *           description: Category name
 *         totalSales:
 *           type: number
 *           description: Total sales amount for the category
 *         totalOrders:
 *           type: integer
 *           description: Total number of orders for the category
 *     ProductSales:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           description: Product ID
 *         productName:
 *           type: string
 *           description: Product name
 *         quantitySold:
 *           type: integer
 *           description: Total quantity sold
 *         totalRevenue:
 *           type: number
 *           description: Total revenue generated
 */

// All sales report routes require admin authentication
router.use(authenticate, isAdmin);

/**
 * @swagger
 * /sales-report/category-wise:
 *   get:
 *     tags:
 *       - Sales Report
 *     summary: Get category-wise sales report
 *     description: Retrieve sales report grouped by categories (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category-wise sales report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategorySales'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/category-wise', salesReportController.getCategorySales);

/**
 * @swagger
 * /sales-report/top-selling:
 *   get:
 *     tags:
 *       - Sales Report
 *     summary: Get top selling products
 *     description: Retrieve a list of top selling products (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductSales'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/top-selling', salesReportController.getTopSellingProducts);

/**
 * @swagger
 * /sales-report/worst-selling:
 *   get:
 *     tags:
 *       - Sales Report
 *     summary: Get worst selling products
 *     description: Retrieve a list of worst selling products (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worst selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductSales'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/worst-selling', salesReportController.getWorstSellingProducts);

export default router;