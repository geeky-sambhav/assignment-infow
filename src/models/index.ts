import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initProductModel } from './product';
import { initCategoryModel } from './category';
import { initUserModel } from './user';
import { initOrderModel } from './order';
import { initOrderItemModel } from './orderItem';
import { initSalesReportModel } from './salesReport';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // disable logging; remove or set to console.log to enable
});

const models = {
  Category: initCategoryModel(sequelize),
  Product: initProductModel(sequelize),
  User: initUserModel(sequelize),
  Order: initOrderModel(sequelize),
  OrderItem: initOrderItemModel(sequelize),
  SalesReport: initSalesReportModel(sequelize),
};

type Models = typeof models;
type ModelName = keyof Models;

// Define associations
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName as ModelName]) {
    models[modelName as ModelName].associate(models);
  }
});

export { sequelize, models };
