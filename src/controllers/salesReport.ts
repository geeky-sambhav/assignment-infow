import { Request, Response } from 'express';
import salesReportService from '../services/salesReport';

export class SalesReportController {
  async getCategorySales(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = this.getDateRange(req);
      const categorySales = await salesReportService.getCategorySalesReport(startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: categorySales,
      });
    } catch (error) {
      console.error('Error fetching category sales:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category sales',
        error: (error as Error).message,
      });
    }
  }

  async getTopSellingProducts(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = this.getDateRange(req);
      const limit = parseInt(req.query.limit as string) || 10;
      
      const topProducts = await salesReportService.getTopSellingProducts(limit, startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: topProducts,
      });
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch top selling products',
        error: (error as Error).message,
      });
    }
  }

  async getWorstSellingProducts(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = this.getDateRange(req);
      const limit = parseInt(req.query.limit as string) || 10;
      
      const worstProducts = await salesReportService.getWorstSellingProducts(limit, startDate, endDate);
      
      res.status(200).json({
        success: true,
        data: worstProducts,
      });
    } catch (error) {
      console.error('Error fetching worst selling products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch worst selling products',
        error: (error as Error).message,
      });
    }
  }

  private getDateRange(req: Request): { startDate?: Date; endDate?: Date } {
    const startDateStr = req.query.startDate as string;
    const endDateStr = req.query.endDate as string;
    
    const startDate = startDateStr ? new Date(startDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;
    
    return { startDate, endDate };
  }
}

export default new SalesReportController();