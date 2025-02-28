// src/server.ts
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import sequelize from './models';
import authRoutes from './routes/authRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// Create a PostgreSQL connection pool using the connection string from the .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Root route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Use auth routes
app.use('/auth', authRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });