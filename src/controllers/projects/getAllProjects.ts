import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AppError } from '../../middleware/errorHandler.js';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

export const getAllProjects = (async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getAll();
    return res.json(projects);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sconosciuto';
    return next(new AppError(message, 500));
  }
}) as unknown as RequestHandler;
