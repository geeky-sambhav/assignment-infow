import { Sequelize, Transaction } from 'sequelize';
import sequelize from '../db/sequelize';
import Order from '../models/order';
import OrderItem from '../models/orderItem';
import Product from '../models/product';

interface OrderItemInput {
  productId: number;
  quantity: number;
}

// Place an order
export const placeOrderService = async (userId: number, items: OrderItemInput[]): Promise<Order> => {
  const transaction: Transaction = await sequelize.sequelize.transaction();

  try {
    // Fetch products to validate and calculate total
    const productIds = items.map(item => item.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction });
    const productMap = new Map<number, any>(products.map(p => [p.id, p]));

    let totalAmount = 0;
    const orderItemsData = items.map(item => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);
      if (item.quantity <= 0) throw new Error(`Quantity for product ID ${item.productId} must be positive`);
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      };
    });

    // Create the order
    const order = await Order.create({ userId, totalAmount, status: 'pending' }, { transaction });

    // Create order items
    const orderItems = orderItemsData.map(item => ({ ...item, orderId: order.id }));
    await OrderItem.bulkCreate(orderItems, { transaction });

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get order history
export const getOrderHistoryService = async (userId: number): Promise<Order[]> => {
  return await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};