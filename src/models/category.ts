import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Product from '../models/product';
import { SalesReport } from './salesReport';

// These are all the attributes in the Category model
interface CategoryAttributes {
  id: number;
  name: string;
  parentId: number | null;

  createdAt: Date;
  updatedAt: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// This is the definition of the Model metadata.
// Note that we do not define the `id` and `timestamps` attributes here.
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public parentId!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // You can define associations here
  static associate(models: any) {
    // Self-referencing association for category hierarchy
    Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
    Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

    // If you have a Products model, you would associate it here
    Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    Category.hasMany(models.SalesReport, { foreignKey: 'categoryId' });
  }
}

export const initCategoryModel = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
    }
  );

  return Category;
};

export default Category;