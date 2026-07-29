import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  link: string;
  images: string[];
  description: string;
  technologies: string[];
  readme: string;
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    link: { type: String, default: "" },
    images: { type: [{ type: String }], default: [] },
    description: { type: String, default: "" },
    technologies: { type: [{ type: String }] },
    readme: { type: String, default: "" },
    version: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
