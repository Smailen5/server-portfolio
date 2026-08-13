import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  authMiddleware,
  jwtAuth,
  AppError,
  validateRequest,
  updateProjectValidator,
} from "../../middleware/index.js";
import { createProjectService } from "../../services/ProjectService.js";

const projectService = createProjectService();

interface ProjectRequest extends Request {
  body: {
    name: string;
    repoUrl: string;
    images: string[];
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

      if (!project) return next(new AppError("Project non trovato", 404));

      return res.json(project);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore sconosciuto";
      return next(new AppError(message, 400));
    }
  },
] as unknown as RequestHandler[];
