import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definizione del tipo per il modello User
export interface UserAttributes {
  id: number;
  email: string;
  name?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isActive?: boolean;
  role: 'admin' | 'user';
}

// Tipo per la creazione di un nuovo utente (senza id)
export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'isActive' | 'role'
>;

// Creazione del modello
const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }
);

export default User as ModelStatic<
  Model<UserAttributes, UserCreationAttributes>
>;
