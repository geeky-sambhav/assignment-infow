import { Request, Response } from 'express';

import { getOrderHistoryService, placeOrderService } from '../services/order';

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body;
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
    
      const userId = req.user.id;
  
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: 'Items array is required and must not be empty' });
      return;
    }
  
    try {
      const order = await placeOrderService(userId, items);
      res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
    } catch (error: any) {
      res.status(500).json({ message: 'Error placing order', error: error.message });
    }
  };
  
  export const getOrderHistory = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
    
      const userId = req.user.id;
  
    try {
      const orders = await getOrderHistoryService(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching order history', error: error.message });
    }
  };

