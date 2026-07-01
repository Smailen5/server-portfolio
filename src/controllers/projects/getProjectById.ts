import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AppError } from '../../middleware/errorHandler.js';
import { idValidator } from '../../middleware/validators/projectValidators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

export const getProjectById = [
  idValidator,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.getById(req.params.id as string);
      if (!project)
        return next(new AppError('Progetto non trovato', 404));
      return res.json(project);
    } catch (err: any) {
      return next(new AppError(err.message, 500));
    }
  },
] as unknown as RequestHandler[];
