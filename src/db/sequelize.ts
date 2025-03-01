import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initCategoryModel } from '../models/category';
import { initProductModel } from 'models/product';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
const Category = initCategoryModel(sequelize);
const Product = initProductModel(sequelize);

// Setup associations
Category.associate({ Category, Product });
Product.associate({ Category });

// Export models
export const db = {
  sequelize,
  Sequelize,
  Category,
  Product,
};

export default db;