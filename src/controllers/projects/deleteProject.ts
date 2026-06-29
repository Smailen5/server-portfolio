import { Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/index.js';
import { jwtAuth } from '../../middleware/auth/jwtAuth.js';
import { idValidator } from '../../middleware/validators/projectValidators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

export const deleteProject = [
  idValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
  async (req: Request, res: Response) => {
    try {
      const project = await projectService.delete(req.params.id as string);
      if (!project)
        return res.status(404).json({ message: 'Project non trovato' });

      return res.json({ message: 'Project eliminato' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
