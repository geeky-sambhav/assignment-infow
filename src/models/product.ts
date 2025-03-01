import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// These are all the attributes in the Product model
interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Some attributes are optional in `Product.create()` call
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt' | 'slug'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public categoryId!: number;
  public slug!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // You can define associations here
  static associate(models: any) {
    // A product belongs to a category
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
  }
}

export const initProductModel = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
     
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      underscored: true, // Use snake_case for the database column names
    }
  );

  return Product;
};

export default Product;