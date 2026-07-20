import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  authMiddleware,
  jwtAuth,
  AppError,
  createProjectValidator,
  validateRequest,
} from "../../middleware/index.js";
import { createProjectService } from "../../services/ProjectService.js";

const projectService = createProjectService();

interface ProjectRequest extends Request {
  body: {
    name: string;
    link: string;
    images: string[];
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
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Errore sconosciuto";
      return next(new AppError(message, 500));
    }
  },
] as unknown as RequestHandler[];
