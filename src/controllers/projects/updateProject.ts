import { Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/auth/auth.js';
import { jwtAuth } from '../../middleware/auth/jwtAuth.js';
import { updateProjectValidator } from '../../middleware/validators/projectValidators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

interface ProjectRequest extends Request {
  body: {
    name: string;
    image: string;
    technologies: string[];
    description: string;
  };
  params: {
    id: string;
  };
}

export const updateProject = [
  updateProjectValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
  async (req: ProjectRequest, res: Response) => {
    try {
      const project = await projectService.update(req.params.id, req.body);

      if (!project)
        return res.status(404).json({ message: 'Project non trovato' });

      return res.json(project);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
