import { Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware';
import { jwtAuth } from '../../middleware/auth/jwtAuth';
import { idValidator } from '../../middleware/validators';
import { validateRequest } from '../../middleware/validatorsRequest';
import Project from '../../models/Project';

export const deleteProject = [
  idValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
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
