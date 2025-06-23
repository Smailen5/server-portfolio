import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  image: string;
  description: string;
  technologies: string[];
  readme: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: { type: [{ type: String }] },
  readme: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
