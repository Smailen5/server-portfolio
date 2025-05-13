import { Request, RequestHandler, Response } from 'express';
import Project from '../../models/Project';

export const getProjectById = (async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project)
      return res.status(404).json({ message: 'Project non trovato' });
    return res.json(project);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler;
