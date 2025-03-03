// src/server.ts
import express, { Request, Response,Application } from 'express';
import dotenv from 'dotenv';
import { sequelize, models } from './models';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import salesReportRoutes from './routes/salesReport';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import swaggerJsdoc from 'swagger-jsdoc';


dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;


app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/sales-report', salesReportRoutes);




app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`Server running on http://localhost:${port}`);
  console.log(` Swagger docs available at http://localhost:${port}/docs`);
})

const startServer = async () => {
    try {
        await sequelize.sync(); 
        console.log('Database synchronized');
       
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

startServer();
