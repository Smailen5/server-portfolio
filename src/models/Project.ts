import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import sequelize from '../config/database';

// Definizione del tipo per il modello Project
export interface ProjectAttributes {
  id: number;
  name: string;
  link: string;
  image: string;
  technologies: string[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Tipo per la creazione di un nuovo project (senza id)
export type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

// Creazione del modello
const Project = sequelize.define<
  Model<ProjectAttributes, ProjectCreationAttributes>
>('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  technologies: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Project as ModelStatic<
  Model<ProjectAttributes, ProjectCreationAttributes>
>;
