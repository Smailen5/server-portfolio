import { IProject } from "../models/Projects.js";
import { ProjectResponse } from "../types/index.js";

export const mapProjectToResponse = (project: IProject): ProjectResponse => ({
  name: project.name,
  description: project.description,
  technologies: project.technologies,
  imagesUrl: project.images,
  repoUrl: project.repoUrl,
  version: project.version,
  createdAt: String(project.createdAt),
  readmeContent: project.readme,
});
