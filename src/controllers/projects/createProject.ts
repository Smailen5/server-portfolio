import { Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/auth/auth';
import { jwtAuth } from '../../middleware/auth/jwtAuth';
import { createProjectValidator } from '../../middleware/validators/validators';
import { validateRequest } from '../../middleware/validators/validatorsRequest';
import {Project} from '../../models/Projects';

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
