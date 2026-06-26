import { Request, RequestHandler, Response } from 'express';
import { idValidator } from '../../middleware/validators/validators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import {Project} from '../../models/Projects.js';

export const getProjectById = [
  idValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const project = await Project.findOne({ _id: req.params.id });
      if (!project)
        return res.status(404).json({ message: 'Progetto non trovato' });
      return res.json(project);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
