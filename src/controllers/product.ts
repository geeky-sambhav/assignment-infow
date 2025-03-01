import { Request, Response } from 'express';
import ProductService from '../services/product';
import { CreateProductDto, UpdateProductDto } from '../types/product';

export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await ProductService.findAll();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message 
    });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await ProductService.findById(parseInt(req.params.id));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching product', 
      error: error.message 
    });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await ProductService.findBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching product', 
      error: error.message 
    });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData: CreateProductDto = req.body;
    const product = await ProductService.create(productData);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData: UpdateProductDto = req.body;
    const product = await ProductService.update(parseInt(req.params.id), productData);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error updating product', 
      error: error.message 
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    await ProductService.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error deleting product', 
      error: error.message 
    });
  }
};