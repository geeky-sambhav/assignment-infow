import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { UserCreationAttributes } from '../types/user';
import { CLIENT_RENEG_LIMIT } from 'tls';

// JWT secret should be in environment variables
const JWT_SECRET :string = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '24h';

// Admin security key should be in environment variables
const ADMIN_SECURITY_KEY :string = process.env.ADMIN_SECURITY_KEY || 'sambhav'

/**
 * Generate JWT token
 */
const generateToken = (id: number, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};


export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("signup called and printing req.body----------------------")
    console.log(req.body);
    const { name, email, password, role }: UserCreationAttributes = req.body;
console.log("after printing req body-----------------------------------------")
    // Validate basic inputs
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Check if user wants to register as admin
    const isAdminSignup = role === 'admin';
console.log("checked role-------------------------------------------")
    // If admin signup, verify security key
    if (isAdminSignup) {
      if (!req.body.securityKey) {
        console.log("checking security key----------------------")
        res.status(400).json({ message: 'Security key is required for admin signup' });
        return;
      }

      if (req.body.securityKey !== ADMIN_SECURITY_KEY) {
        res.status(401).json({ message: 'Invalid security key' });
        return;
      }
    }

    // Check if user already exists
    console.log("checking existing user--------------------------------")
    const existingUser = await User.findOne({ where: { email } });
    console.log("checked existing user--------------------------------")
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    console.log("checking password------------------------------------")
    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const userData: UserCreationAttributes = {
      name,
      email,
      password: hashedPassword,
      role: isAdminSignup ? 'admin' : 'user',
    };

    const user = await User.create(userData);

    // Send response with token
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error: unknown) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ message: 'Email already in use' });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    if(user.role==="admin"){
      res.json({
        message:"wrong api endpoint"
      })
      return
    }

    // Check password
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Send response with token
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Find admin user
    const admin = await User.findOne({ where: { email, role: 'admin' } });
    if (!admin) {
      res.status(401).json({ message: 'Invalid admin credentials' });
      return;
    }

    // Check password
    const validPassword = await bcryptjs.compare(password, admin.password);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid admin credentials' });
      return;
    }

    // Send response with token
    res.status(200).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin.id, admin.role),
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

