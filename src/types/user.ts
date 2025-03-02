import { Optional } from 'sequelize';

// src/types/user.ts
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

// Exclude 'id' from the attributes required when creating a user
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export type UserResponse = Omit<UserAttributes, 'password'>;