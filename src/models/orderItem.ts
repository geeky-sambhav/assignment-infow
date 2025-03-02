import { Model, DataTypes, Sequelize } from 'sequelize';

class OrderItem extends Model {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public price!: number;

  static associate(models: any) {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }
}

export const initOrderItemModel = (sequelize: Sequelize) => {
  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      timestamps: false,
    }
  );

  return OrderItem;
};

export default OrderItem;