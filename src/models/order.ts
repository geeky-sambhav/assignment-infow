import { DataTypes, Model, Sequelize } from 'sequelize';
import OrderItem from './orderItem'; // Ensure OrderItem model is imported

class Order extends Model {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Add static associate method
  static associate(models: any) {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  }
}

export const initOrderModel = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
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
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,
    }
  );

  return Order;
};

export default Order;