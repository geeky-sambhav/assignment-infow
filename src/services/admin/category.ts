import { Op } from 'sequelize';

import db from '../../db/sequelize';
import { CreateCategoryDto, UpdateCategoryDto, CategoryAttributes } from '../../types/category';
import Category from '../../models/category';
import Product from '../../models/product';

class CategoryService {
  async findAll(): Promise<CategoryAttributes[]> {
    return Category.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return Category.findOne({ where: { name } });
  }

  async findById(id: number): Promise<Category | null> {
    return Category.findByPk(id);
  }

  async create(categoryData: CreateCategoryDto): Promise<Category> {
    const { name } = categoryData;

    // Check for duplicate name
    const existingCategory = await this.findByName(name);
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
    
    // Create new category
    const category = await Category.create({
      name
    });

    return category;
  }

  async update(id: number, categoryData: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // If updating name, check for duplicates
    if (categoryData.name) {
      const existingCategory = await this.findByName(categoryData.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new Error('Category with this name already exists');
      }
    }

    // Only update the name field
    await category.update({ name: categoryData.name });
    
    return category;
  }

  async delete(id: number): Promise<void> {
    // Find category by id
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Check if category has children
  
    
    
    // Check if products are associated with this category
    const productsCount = await Product.count({
      where: { categoryId: id }
    });
    
    if (productsCount > 0) {
      throw new Error('Cannot delete category with associated products');
    }
    
    // Delete category
    await category.destroy();
  }

  async findWithProducts(id: number) {
    return db.Category.findByPk(id, {
      include: [
        {
          model: db.Product,
          as: 'products',
        },
      ],
    });
  }


}

export default new CategoryService();