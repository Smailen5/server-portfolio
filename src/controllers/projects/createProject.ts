import { NextFunction, Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/auth/auth.js';
import { jwtAuth } from '../../middleware/auth/jwtAuth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { createProjectValidator } from '../../middleware/validators/projectValidators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

interface ProjectRequest extends Request {
  body: {
    name: string;
    link: string;
    image: string;
    technologies: string[];
    description: string;
    readme: string;
  };
}

export const createProject = [
  createProjectValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
  async (req: ProjectRequest, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.create(req.body);

      return res.status(201).json(project);
    } catch (error: any) {
      return next(new AppError(error.message, 500));
    }
  },
] as unknown as RequestHandler[];
