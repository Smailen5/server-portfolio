import { Request, RequestHandler, Response } from 'express';
import Project from '../../models/Project';

interface ProjectRequest extends Request {
  body: {
    name: string;
    link: string;
    image: string;
    technologies: string[];
    description: string;
  };
}

export const createProject = (async (req: ProjectRequest, res: Response) => {
  try {
    const newProject = await Project.create({
      name: req.body.name,
      link: req.body.link,
      image: req.body.image,
      technologies: req.body.technologies,
      description: req.body.description,
    });
    return res.status(201).json(newProject);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}) as unknown as RequestHandler;
