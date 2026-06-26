import { Request, RequestHandler, Response } from 'express';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

export const getAllProjects = (async (_req: Request, res: Response) => {
  try {
    const projects = await projectService.getAll();
    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler;
