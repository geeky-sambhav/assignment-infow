import { Op } from 'sequelize';
import slugify from 'slugify';
import db from '../../db/sequelize';
import { CreateProductDto, UpdateProductDto } from '../../types/product';

class ProductService {
  async findAll() {
    return db.Product.findAll({
      include: [
        {
          model: db.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  async findById(id: number) {
    return db.Product.findByPk(id, {
      include: [
        {
          model: db.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async findBySlug(slug: string) {
    return db.Product.findOne({ 
      where: { slug },
      include: [
        {
          model: db.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
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
    const category = await db.Category.findByPk(productData.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Create product
    const product = await db.Product.create({
      ...productData,
      slug
    });

    return this.findById(product.id); // Return with category included
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
      const slugExists = await db.Product.findOne({
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
      const category = await db.Category.findByPk(productData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    await product.update(productData);
    return this.findById(id); // Return updated product with category included
  }

  async delete(id: number) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await product.destroy();
    return true;
  }

  async findByCategory(categoryId: number) {
    return db.Product.findAll({
      where: { categoryId },
      include: [
        {
          model: db.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['name', 'ASC']],
    });
  }
}

export default new ProductService();