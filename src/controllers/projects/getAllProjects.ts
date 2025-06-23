import { Request, RequestHandler, Response } from 'express';
import {Project} from '../../models/Projects';

export const getAllProjects = (async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find({
      order: [['createdAt', 'DESC']],
    });
    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler;
