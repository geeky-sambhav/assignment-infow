// src/models/user.ts
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import Order from './order'; // Ensure Order model is imported

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

// Define creation attributes - id is optional since it's auto-generated
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin';

  static associate(models: any) {
    User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
  }
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
    }
  );

  return User;
};

export default User;
