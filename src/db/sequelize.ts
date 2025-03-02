import { Sequelize } from 'sequelize';
import { DATABASE_CONFIG } from '../config';
import { initCategoryModel } from '../models/category';
import { initProductModel } from '../models/product';
import { initOrderModel } from '../models/order';
import { initOrderItemModel } from '../models/orderItem';
import { initUserModel } from '../models/user';
import { initSalesReportModel } from '../models/salesReport';

console.log('Attempting to connect to database with config:', DATABASE_CONFIG);

const sequelize = new Sequelize(DATABASE_CONFIG.url, {
  dialect: DATABASE_CONFIG.dialect,
  logging: DATABASE_CONFIG.logging,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }
});

// Initialize all models
const User = initUserModel(sequelize);
const Category = initCategoryModel(sequelize);
const Product = initProductModel(sequelize);
const Order = initOrderModel(sequelize);
const OrderItem = initOrderItemModel(sequelize);
const SalesReport = initSalesReportModel(sequelize);

// Setup associations after all models are initialized
Category.associate({ Category, Product, SalesReport });
Product.associate({ Category });
User.associate({ Order });
Order.associate({ User, OrderItem });
OrderItem.associate({ Order, Product });
SalesReport.associate({ Category, Product });

// Test the connection and sync models
console.log('Testing database connection...');
sequelize.authenticate()
  .then(async () => {
    console.log('✓ Database connection established successfully.');
    
    // Drop all tables and sequences first
    try {
      // Drop existing tables
      await sequelize.getQueryInterface().dropAllTables();
      
      // Drop sequences
      const sequences = ['users_id_seq', 'categories_id_seq', 'products_id_seq', 'orders_id_seq', 'order_items_id_seq', 'sales_reports_id_seq'];
      for (const seq of sequences) {
        try {
          await sequelize.query(`DROP SEQUENCE IF EXISTS "${seq}" CASCADE;`);
        } catch (error: any) {
          console.log(`Note: Sequence ${seq} might not exist, continuing...`);
        }
      }
      
      console.log('✓ Cleaned up existing tables and sequences.');
    } catch (error: any) {
      console.log('Note: Some cleanup operations failed, continuing with sync:', error.message);
    }

    // Now sync all models
    console.log('Synchronizing models...');
    await sequelize.sync({ force: true });
    console.log('✓ All models were synchronized successfully.');
  })
  .catch((error: any) => {
    console.error('❌ Database connection error:', error.message);
    console.error('Error details:', error);
    process.exit(1); // Exit if we can't connect to database
  });

// Export models
export const db = {
  sequelize,
  Sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  SalesReport
};

export default db;