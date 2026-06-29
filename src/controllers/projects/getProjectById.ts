import { Request, RequestHandler, Response } from 'express';
import { idValidator } from '../../middleware/validators/projectValidators.js';
import { validateRequest } from '../../middleware/validators/validatorsRequest.js';
import { createProjectService } from '../../services/ProjectService.js';

const projectService = createProjectService();

export const getProjectById = [
  idValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const project = await projectService.getById(req.params.id as string);
      if (!project)
        return res.status(404).json({ message: 'Progetto non trovato' });
      return res.json(project);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
] as unknown as RequestHandler[];
