// src/server.ts
import express, { Request, Response,Application } from 'express';
import dotenv from 'dotenv';
import { sequelize, models } from './models';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import cors from 'cors';

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Load environment variables from .env file
dotenv.config();


const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;


const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
      openapi: "3.0.0",
      info: {
          title: "My API Documentation",
          version: "1.0.0",
          description: "Automatically generated API documentation for the TypeScript backend",
      },
      servers: [
          { url: "http://localhost:3000", description: "Local server" },
      ],
  },
  apis: ["./routes/*.ts"], // Point to where your route files are located
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



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
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📜 Swagger docs available at http://localhost:${port}/api-docs`);
})

  const startServer = async () => {
    try {
        await sequelize.sync({ alter:true }); // Use force: true only for development to drop existing tables
        console.log('Database synchronized');
        // Start your server here
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

startServer();
