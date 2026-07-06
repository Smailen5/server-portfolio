import { NextFunction, Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/index.js';
import { jwtAuth } from '../../middleware/auth/jwtAuth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { idValidator } from '../../middleware/validators/projectValidators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

export const deleteProject = [
  idValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.delete(req.params.id as string);
      if (!project)
        return next(new AppError('Project non trovato', 404));

      return res.json({ message: 'Project eliminato' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      return next(new AppError(message, 500));
    }
  },
] as unknown as RequestHandler[];
