import { Request, RequestHandler, Response } from 'express';
import {
  authMiddleware,
  idValidator,
  validateRequest,
} from '../../middleware/';
import Project from '../../models/Project';

export const deleteProject = [
  idValidator,
  validateRequest,
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project)
        return res.status(404).json({ message: 'Project non trovato' });

      await project.destroy();
      return res.json({ message: 'Project eliminato' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
