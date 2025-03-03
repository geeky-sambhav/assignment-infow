import { Op, Sequelize } from 'sequelize';
import SalesReport, { SalesReportAttributes, SalesReportCreationAttributes } from '../models/salesReport';
import Product from '../models/product';
import Category from '../models/category';
import { CategorySalesReport, ProductSalesReport } from '../types/salesReport';

interface OrderItemData {
  productId: number;
  quantity: number;
  price: number;
  category: number;
}

export class SalesReportService {
  async addSalesReport(orderItems: OrderItemData[]): Promise<void> {
    try {
      const now = new Date();
      
      // Group order items by productId to sum quantities and revenue
      const aggregatedItems = orderItems.reduce((acc, item) => {
        const key = item.productId;
        if (!acc[key]) {
          acc[key] = {
            productId: item.productId,
            quantity: 0,
            categoryId: item.category,
            revenue: 0
          };
        }
        acc[key].quantity += item.quantity;
        // Convert price to integer (assuming price is in decimal like 10.99)
        const itemRevenue = Math.round(item.price * item.quantity);
        acc[key].revenue += itemRevenue;
        return acc;
      }, {} as Record<string, {
        productId: number;
        quantity: number;
        categoryId: number;
        revenue: number;
      }>);

      console.log('Aggregated items:', aggregatedItems);

      // Process each aggregated item
      for (const item of Object.values(aggregatedItems)) {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const existingReport = await SalesReport.findOne({
          where: {
            productId: item.productId,
            date: {
              [Op.gte]: startOfDay,
              [Op.lte]: endOfDay
            }
          }
        });

        console.log('Existing report:', existingReport?.toJSON());
        console.log('New item data:', item);
        if (existingReport) {
          // Revenue is now guaranteed to be a number
          const newRevenue = existingReport.revenue + item.revenue;
          const newQuantity = existingReport.quantity + item.quantity;
          
          console.log('Updating report:', {
            currentRevenue: existingReport.revenue,
            addingRevenue: item.revenue,
            newRevenue,
            currentQuantity: existingReport.quantity,
            addingQuantity: item.quantity,
            newQuantity
          });
          
          await existingReport.update({
            quantity: newQuantity,
            revenue: newRevenue,
            updatedAt: now
          });
          
          console.log('Updated report:', (await existingReport.reload()).toJSON());
        } else {
          // Create new record
          const newReport = await SalesReport.create({
            productId: item.productId,
            quantity: item.quantity,
            categoryId: item.categoryId,
            revenue: item.revenue,
            date: now,
            createdAt: now,
            updatedAt: now
          });

          console.log('Created new report:', newReport.toJSON());
        }
      }

      console.log('Sales reports processed successfully');
    } catch (error) {
      console.error('Error processing sales report:', error);
      throw error;
    }
  }

  async getCategorySalesReport(): Promise<CategorySalesReport[]> {
    const categorySales = await SalesReport.findAll({
      attributes: [
        'categoryId',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSales'],
        [Sequelize.fn('SUM', Sequelize.col('revenue')), 'totalRevenue'],
      ],
      include: [
        {
          model: Category,
          attributes: ['name'],
          required: true,
        },
      ],
      group: ['categoryId', 'Category.id', 'Category.name'],
      order: [[Sequelize.fn('SUM', Sequelize.col('revenue')), 'DESC']], 
    });
    
    return categorySales.map((sale: any) => ({
      categoryId: sale.categoryId,
      categoryName: sale.Category.name,
      totalSales: parseInt(sale.getDataValue('totalSales'), 10),
      totalRevenue: sale.getDataValue('totalRevenue'),
    }));
  }

  async getTopSellingProducts(limit: number = 10): Promise<ProductSalesReport[]> {
    console.log("top products starting vale is ----------------------------")
    
    const topProducts = await SalesReport.findAll({
      attributes: [
        'productId',
        'quantity',
        'revenue',
        [Sequelize.col('Product.name'), 'productName'],
      ],
      include: [
        {
          model: Product,
          attributes: [],
          required: true,
        },
      ],
      group: ['productId', 'Product.name', 'quantity', 'revenue'],
      order: [['quantity', 'DESC']], 
    });
  console.log("topProducts is---------------------------",topProducts)
    return topProducts.map((product: any) => ({
      productId: product.productId,
      productName: product.getDataValue('productName'),
      totalSales: product.quantity,
      totalRevenue: product.revenue,
    }));
  }
  async getWorstSellingProducts(limit: number = 10): Promise<ProductSalesReport[]> {
    console.log("worst products starting vale is ----------------------------")
    
    const worstProducts = await SalesReport.findAll({
      attributes: [
        'productId',
        'quantity',
        'revenue',
        [Sequelize.col('Product.name'), 'productName'],
      ],
      include: [
        {
          model: Product,
          attributes: [],
          required: true,
        },
      ],
      group: ['productId', 'Product.name', 'quantity', 'revenue'],
      order: [['quantity', 'ASC']], 
    });
  console.log("worstProducts is---------------------------",worstProducts)
    return worstProducts.map((product: any) => ({
      productId: product.productId,
      productName: product.getDataValue('productName'),
      totalSales: product.quantity,
      totalRevenue: product.revenue,
    }));
  }
}

export default new SalesReportService();