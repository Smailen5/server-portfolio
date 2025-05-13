import { Request, RequestHandler, Response, Router } from 'express';
import Project from '../models/Project';

const router = Router();

// Definizione dei tipi per le richieste
interface ProjectRequest extends Request {
  body: {
    name: string;
    link: string;
    image: string;
    technologies: string[];
    description: string;
  };
  params: {
    id: string;
  };
}

// Get all projects
router.get('/', (async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler);

// Get single project
router.get('/:id', (async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project non found' });
    return res.json(project);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler);

// Create new project
router.post('/', (async (req: ProjectRequest, res: Response) => {
  const project = new Project({
    name: req.body.name,
    link: req.body.link,
    image: req.body.image,
    technologies: req.body.technologies,
    description: req.body.description,
  });
  try {
    const newProject = await project.save();
    return res.status(201).json(newProject);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}) as unknown as RequestHandler);

// Update project
router.put('/:id', (async (req: ProjectRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.name = req.body.name || project.name;
    project.link = req.body.link || project.link;
    project.image = req.body.image || project.image;
    project.technologies = req.body.technologies || project.technologies;
    project.description = req.body.description || project.description;

    const updateProject = await project.save();
    return res.json(updateProject);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}) as unknown as RequestHandler);

// Delete project
router.delete('/:id', (async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.json({ message: 'Project deleted' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler);

export default router;
