// src/server.ts
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { sequelize, models } from './models';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Root route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Use auth routes
app.use('/auth', authRoutes);

// Use category routes
app.use('/categories', categoryRoutes);

// Use product routes
app.use('/products', productRoutes);

// Initialize database and start server
console.log('Initializing database...');
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ force: true }); // This will drop and recreate tables
  })
  .then(() => {
    console.log('All tables created successfully.');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
    console.error('Error details:', err);
    process.exit(1); // Exit if database connection fails
  });