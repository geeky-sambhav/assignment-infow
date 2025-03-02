import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database configuration
export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/infoware',
  dialect: 'postgres' as const,
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
};

// Other configurations can be added here
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
