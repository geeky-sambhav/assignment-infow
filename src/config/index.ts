import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'sambhav';
export const PORT = process.env.PORT || 3000;
export const ADMIN_SECURITY_KEY = process.env.ADMIN_SECURITY_KEY || 'infoware';

export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL || 'postgresql://ecommerce_owner:npg_tih4YzXFp8KP@ep-super-block-a81sxpww-pooler.eastus2.azure.neon.tech/ecommerce',
  dialect: 'postgres' as const,
  logging: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};
