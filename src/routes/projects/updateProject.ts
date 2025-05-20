import { Request, RequestHandler, Response } from 'express';
import {
  authMiddleware,
  updateProjectValidator,
  validateRequest,
} from '../../middleware/';
import Project, { ProjectAttributes } from '../../models/Project';

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
  async (req: ProjectRequest, res: Response) => {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project)
        return res.status(404).json({ message: 'Project non trovato' });

      const projectData = project.get({ plain: true }) as ProjectAttributes;

      await project.update({
        name: req.body.name || projectData.name,
        image: req.body.image || projectData.image,
        technologies: req.body.technologies || projectData.technologies,
        description: req.body.description || projectData.description,
      });

      return res.json(project);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
