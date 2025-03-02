import { Op, Sequelize } from 'sequelize';
import { SalesReport } from '../models/salesReport';
import Product, { initProductModel } from '../models/product';
import Category, { initCategoryModel } from '../models/category';
import { CategorySalesReport, ProductSalesReport } from '../types/salesReport';

export class SalesReportService {
  async getCategorySalesReport(startDate?: Date, endDate?: Date): Promise<CategorySalesReport[]> {
    const dateFilter = this.getDateFilter(startDate, endDate);
    
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
      where: {
        categoryId: { [Op.not]: null },
        ...dateFilter,
      },
      group: ['categoryId', 'Category.name'],
      order: [[Sequelize.literal('totalRevenue'), 'DESC']],
    });

    return categorySales.map((sale: any) => ({
      categoryId: sale.categoryId,
      categoryName: sale.Category.name,
      totalSales: parseInt(sale.getDataValue('totalSales'), 10),
      totalRevenue: parseFloat(sale.getDataValue('totalRevenue')),
    }));
  }

  async getTopSellingProducts(limit: number = 10, startDate?: Date, endDate?: Date): Promise<ProductSalesReport[]> {
    const dateFilter = this.getDateFilter(startDate, endDate);
    
    const topProducts = await SalesReport.findAll({
      attributes: [
        'productId',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSales'],
        [Sequelize.fn('SUM', Sequelize.col('revenue')), 'totalRevenue'],
      ],
      include: [
        {
          model: Product,
          attributes: ['name'],
          required: true,
        },
      ],
      where: {
        productId: { [Op.not]: null },
        ...dateFilter,
      },
      group: ['productId', 'Product.name'],
      order: [[Sequelize.literal('totalSales'), 'DESC']],
      limit,
    });

    return topProducts.map((product: any) => ({
      productId: product.productId,
      productName: product.Product.name,
      totalSales: parseInt(product.getDataValue('totalSales'), 10),
      totalRevenue: parseFloat(product.getDataValue('totalRevenue')),
    }));
  }

  async getWorstSellingProducts(limit: number = 10, startDate?: Date, endDate?: Date): Promise<ProductSalesReport[]> {
    const dateFilter = this.getDateFilter(startDate, endDate);
    
    const worstProducts = await SalesReport.findAll({
      attributes: [
        'productId',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSales'],
        [Sequelize.fn('SUM', Sequelize.col('revenue')), 'totalRevenue'],
      ],
      include: [
        {
          model: Product,
          attributes: ['name'],
          required: true,
        },
      ],
      where: {
        productId: { [Op.not]: null },
        ...dateFilter,
      },
      group: ['productId', 'Product.name'],
      order: [[Sequelize.literal('totalSales'), 'ASC']],
      limit,
    });

    return worstProducts.map((product: any) => ({
      productId: product.productId,
      productName: product.Product.name,
      totalSales: parseInt(product.getDataValue('totalSales'), 10),
      totalRevenue: parseFloat(product.getDataValue('totalRevenue')),
    }));
  }

  private getDateFilter(startDate?: Date, endDate?: Date) {
    const dateFilter: any = {};
    
    if (startDate || endDate) {
      dateFilter.date = {};
      
      if (startDate) {
        dateFilter.date[Op.gte] = startDate;
      }
      
      if (endDate) {
        dateFilter.date[Op.lte] = endDate;
      }
    }
    
    return dateFilter;
  }
}

export default new SalesReportService();