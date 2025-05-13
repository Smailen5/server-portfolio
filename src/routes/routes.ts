import { Request, RequestHandler, Response, Router } from 'express';
import Project, { ProjectAttributes } from '../models/Project';

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
    const projects = await Project.findAll();
    return res.json(projects);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler);

// Get single project
router.get('/:id', (async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project)
      return res.status(404).json({ message: 'Project non trovato' });
    return res.json(project);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler);

// Create new project
router.post('/', (async (req: ProjectRequest, res: Response) => {
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
}) as unknown as RequestHandler);

// Update project
router.put('/:id', (async (req: ProjectRequest, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project)
      return res.status(404).json({ message: 'Project non trovato' });

    const projectData = project.get({ plain: true }) as ProjectAttributes;

    await project.update({
      name: req.body.name || projectData.name,
      link: req.body.link || projectData.link,
      image: req.body.image || projectData.image,
      technologies: req.body.technologies || projectData.technologies,
      description: req.body.description || projectData.description,
    });

    return res.json(project);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}) as unknown as RequestHandler);

// Delete project
router.delete('/:id', (async (req: Request, res: Response) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project)
      return res.status(404).json({ message: 'Project non trovato' });

    await project.destroy();
    return res.json({ message: 'Project eliminato' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler);

export default router;
