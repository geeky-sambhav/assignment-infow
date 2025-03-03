import { Op } from 'sequelize';
import slugify from 'slugify';
import { CreateProductDto, UpdateProductDto } from '../types/product';
import Product from '../models/product';
import Category from '../models/category';

class ProductService {
  async findAll() {
    return Product.findAll({
      include: [{
        model: Category,
        as: 'category'
      }]
    });
  }

  async findById(id: number) {
    return Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });
  }

  async findBySlug(slug: string) {
    return Product.findOne({
      where: { slug },
      include: [{
        model: Category,
        as: 'category'
      }]
    });
  }

  async create(productData: CreateProductDto) {
    // Generate slug from name
    const slug = slugify(productData.name, { lower: true });

    // Check for duplicate slug
    const existingProduct = await this.findBySlug(slug);
    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }

    // Check if category exists
    const category = await Category.findByPk(productData.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Create product
    const product = await Product.create({
      ...productData,
      slug
    });

    return this.findById(product.id); 
  }

  async update(id: number, productData: UpdateProductDto) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // If updating name, update slug and check for duplicates
    if (productData.name) {
      const newSlug = slugify(productData.name, { lower: true });
      
      // Check if new slug would conflict with existing product (other than this one)
      const slugExists = await Product.findOne({
        where: {
          slug: newSlug,
          id: { [Op.ne]: id }
        }
      });

      if (slugExists) {
        throw new Error('Product with this name already exists');
      }

      productData = { ...productData, slug: newSlug };
    }

    // If updating category, check if it exists
    if (productData.categoryId) {
      const category = await Category.findByPk(productData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    await product.update(productData);
    return this.findById(id); 
  }

  async delete(id: number) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.destroy();
  }

  async findByCategory(categoryId: number) {
    return Product.findAll({
      where: { categoryId },
      include: [{
        model: Category,
        as: 'category'
      }]
    });
  }
}

export default new ProductService();
