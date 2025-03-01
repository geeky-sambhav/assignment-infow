import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'sambhav';

// Extend the Express Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT token and set user in request object
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };
    
    // Set user info in request object
    req.user = decoded;
    
    return next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
      return 
  }
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
     res.status(401).json({ message: 'Authentication required' });
     return;
  }
  
  if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
    return
  }
  
  return next();
};
