import { Request, RequestHandler, Response } from 'express';
import Project from '../../../models/Project';

export const getAllProjects = (async (_req: Request, res: Response) => {
  try {
    const projects = await Project.findAll();
    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler;
