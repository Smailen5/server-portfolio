import { Request, RequestHandler, Response } from 'express';
import { authMiddleware } from '../../middleware/auth/auth';
import { jwtAuth } from '../../middleware/auth/jwtAuth';
import { updateProjectValidator } from '../../middleware/validators/validators';
import { validateRequest } from '../../middleware/validators/validatorsRequest';
import { Project } from '../../models/Projects';

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
  async (req: ProjectRequest, res: Response) => {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          image: req.body.image,
          technologies: req.body.technologies,
          description: req.body.description,
        },
        { new: true }
      );

      if (!project)
        return res.status(404).json({ message: 'Project non trovato' });

      return res.json(project);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
