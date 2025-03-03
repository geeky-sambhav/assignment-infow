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

// Test database connection
sequelize
  .authenticate()
  .then(async () => {
    console.log('✓ Database connection established successfully.');
    
    try {
      // Now sync all models
      console.log('Synchronizing models...');
      await sequelize.sync();
      console.log('✓ All models were synchronized successfully.');
    } catch (error: any) {
      console.error('❌ Synchronization error:', error.message);
      console.error('Error details:', error);
      process.exit(1);
    }
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