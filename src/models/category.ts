import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Product from './product';

// These are all the attributes in the Category model
interface CategoryAttributes {
  id: number;
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  name: string;
}

// This is the definition of the Model metadata.
// Note that we do not define the `id` and `timestamps` attributes here.
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;

  public createdAt!: Date;
  public updatedAt!: Date;

  // You can define associations here
  static associate(models: any) {
    // Self-referencing association for category hierarchy
    Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

    // If you have a Products model, you would associate it here
    Category.hasMany(Product, { foreignKey: 'categoryId' });
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