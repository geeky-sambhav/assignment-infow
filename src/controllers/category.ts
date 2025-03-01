import { Request, Response } from 'express';
import CategoryService from '../services/category';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/category';

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await CategoryService.findAll();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching categories', 
      error: error.message 
    });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await CategoryService.findById(parseInt(req.params.id));
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching category', 
      error: error.message 
    });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryData: CreateCategoryDto = req.body;
    const category = await CategoryService.create(categoryData);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error creating category', 
      error: error.message 
    });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryData: UpdateCategoryDto = req.body;
    const category = await CategoryService.update(parseInt(req.params.id), categoryData);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error updating category', 
      error: error.message 
    });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    await CategoryService.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ 
      message: 'Error deleting category', 
      error: error.message 
    });
  }
};

export const getCategoryWithProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await CategoryService.findWithProducts(parseInt(req.params.id));
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Error fetching category with products', 
      error: error.message 
    });
  }
};
