import { Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/auth/auth.js';
import { jwtAuth } from '../../middleware/auth/jwtAuth.js';
import { createProjectValidator } from '../../middleware/validators/validators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import {Project} from '../../models/Projects.js';

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
  async (req: ProjectRequest, res: Response) => {
    try {
      const project = await Project.create({
        name: req.body.name,
        link: req.body.link,
        description: req.body.description,
        image: req.body.image,
        technologies: req.body.technologies,
        readme: req.body.readme,
      });

      return res.status(201).json(project);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
] as unknown as RequestHandler[];
