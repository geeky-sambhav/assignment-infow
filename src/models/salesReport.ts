import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import Category from './category';
import Product from './product';

interface SalesReportAttributes {
  id: number;
  categoryId?: number;
  productId?: number;
  quantity: number;
  revenue: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SalesReportCreationAttributes extends Optional<SalesReportAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class SalesReport extends Model<SalesReportAttributes, SalesReportCreationAttributes> implements SalesReportAttributes {
  public id!: number;
  public categoryId!: number;
  public productId!: number;
  public quantity!: number;
  public revenue!: number;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    SalesReport.belongsTo(models.Category, { foreignKey: 'categoryId', targetKey: 'id' });
    SalesReport.belongsTo(models.Product, { foreignKey: 'productId' });
  }
}

export const initSalesReportModel = (sequelize: Sequelize) => {
  SalesReport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      revenue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
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
      tableName: 'sales_reports',
      timestamps: true,
    }
  );

  return SalesReport;
};
