import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// These are all the attributes in the Category model
interface CategoryAttributes {
  id: number;
  name: string;
 

  createdAt: Date;
  updatedAt: Date;
}


class Category extends Model<CategoryAttributes> implements CategoryAttributes {
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
      modelName: 'Category',
      tableName: 'categories',
    }
  );

  return Category;
};

export default Category;