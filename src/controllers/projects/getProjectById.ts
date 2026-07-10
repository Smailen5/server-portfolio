import { NextFunction, Request, RequestHandler, Response } from 'express';
import { 
  AppError,
  idValidator,
  validateRequest
} from '../../middleware/index.js';
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      return next(new AppError(message, 500));
    }
  },
] as unknown as RequestHandler[];
