import { CreateCategoryDto, UpdateCategoryDto } from '../types/category';
import Category from '../models/category';
import Product from '../models/product';

class CategoryService {
  async findAll() {
    return Category.findAll();
  }

  async findById(id: number) {
    return Category.findByPk(id);
  }

  async findByName(name: string) {
    return Category.findOne({ where: { name } });
  }

  async create(categoryData: CreateCategoryDto) {
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

  async update(id: number, categoryData: UpdateCategoryDto) {
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

    await category.update(categoryData);
    return category;
  }

  async delete(id: number) {
    const category = await this.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if products are associated with this category
    const productsCount = await Product.count({
      where: { categoryId: id }
    });
    
    if (productsCount > 0) {
      throw new Error('Cannot delete category with associated products');
    }

    await category.destroy();
  }

  async findWithProducts(id: number) {
    return Category.findByPk(id, {
      include: [{
        model: Product,
        as: 'products'
      }]
    });
  }
}

export default new CategoryService();
