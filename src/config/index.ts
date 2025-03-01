import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'sambhav';
export const PORT = process.env.PORT || 3000;
export const ADMIN_SECURITY_KEY = process.env.ADMIN_SECURITY_KEY || 'infoware';

export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL || 'postgresql://localhost:5432/infoware',
  dialect: 'postgres' as const,
  logging: false,
};
