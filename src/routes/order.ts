import express from 'express';
import { authenticate } from '../middleware/auth';
import { placeOrder, getOrderHistory } from '../controllers/order';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: ID of the product
 *         quantity:
 *           type: integer
 *           description: Quantity of the product
 *         
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Order ID
 *         userId:
 *           type: integer
 *           description: ID of the user who placed the order
 *         totalAmount:
 *           type: number
 *           description: Total order amount
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           description: Order status
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation timestamp
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Place a new order
 *     description: Create a new order with multiple products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request or insufficient stock
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 */
router.post('/', authenticate, placeOrder);

/**
 * @swagger
 * /orders/history:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order history
 *     description: Retrieve order history for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 */
router.get('/history', authenticate, getOrderHistory);

export default router;