import { NextFunction, Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/auth/auth.js';
import { jwtAuth } from '../../middleware/auth/jwtAuth.js';
import { AppError } from '../../middleware/errorHandler.js';
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
  async (req: ProjectRequest, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.update(req.params.id, req.body);

      if (!project)
        return next(new AppError('Project non trovato', 404));

      return res.json(project);
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  },
] as unknown as RequestHandler[];
