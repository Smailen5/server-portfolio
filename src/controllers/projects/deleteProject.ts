import { Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware';
import { jwtAuth } from '../../middleware/auth/jwtAuth';
import { idValidator } from '../../middleware/validators/validators';
import { validateRequest } from '../../middleware/validators/validatorsRequest';
import {Project} from '../../models/Projects';

export const deleteProject = [
  idValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
  async (req: Request, res: Response) => {
    try {
      const project = await Project.findOne({ _id:req.params.id });
      if (!project)
        return res.status(404).json({ message: 'Project non trovato' });

      await project.deleteOne({ _id: req.params.id });
      return res.json({ message: 'Project eliminato' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
