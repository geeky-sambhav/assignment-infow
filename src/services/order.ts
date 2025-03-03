import { Sequelize, Transaction } from 'sequelize';
import sequelize from '../db/sequelize';
import Order from '../models/order';
import OrderItem from '../models/orderItem';
import Product from '../models/product';
import salesReportService from './salesReport';

interface OrderItemInput {
  productId: number;
  quantity: number;
}

// Place an order
export const placeOrderService = async (userId: number, items: OrderItemInput[]): Promise<Order> => {
  const transaction: Transaction = await sequelize.sequelize.transaction();

  try {
    // Fetch products to validate and calculate total
    console.log("ordered------------------------------------")
    const productIds = items.map(item => item.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction });
    const productMap = new Map<number, any>(products.map(p => [p.id, p]));

    let totalAmount = 0;
    const orderItemsData = items.map(item => {
      const product = productMap.get(item.productId);
      console.log("product is---------------------------",product)
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);
      if (item.quantity <= 0) throw new Error(`Quantity for product ID ${item.productId} must be positive`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for product ID ${item.productId}`);
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        category: product.categoryId
      };
    });

    // Create the order
    const order = await Order.create({ userId, totalAmount, status: 'pending' }, { transaction });

    // Create order items with the price from the corresponding product
    const orderItems = orderItemsData.map(item => ({
      ...item,
      orderId: order.id
    }));
    
    await OrderItem.bulkCreate(orderItems, { transaction });

    // Update product stock
    for (const item of orderItemsData) {
      const product = productMap.get(item.productId);
      await Product.update(
        { stock: product.stock - item.quantity },
        { 
          where: { id: item.productId },
          transaction
        }
      );
    }

    // Update order status to success
    await order.update({ status: 'success' }, { transaction });

    await transaction.commit();

    // Create sales report entries after successful order
    console.log("adding sales report yeahh------------------------------")
    await salesReportService.addSalesReport(orderItemsData);
    console.log("added sales report yeahh------------------------------")
    return order;
    
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Get order history
export const getOrderHistoryService = async (userId: number): Promise<Order[]> => {
  try {
    const orders = await Order.findAll({
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

    return orders;
  } catch (error) {
    throw error;
  }
};