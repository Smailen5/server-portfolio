import { Router } from 'express';
import { createProject } from '../../controllers/projects/createProject';
import { deleteProject } from '../../controllers/projects/deleteProject';
import { getAllProjects } from '../../controllers/projects/getAllProjects';
import { getProjectById } from '../../controllers/projects/getProjectById';
import { updateProject } from '../../controllers/projects/updateProject';

const router = Router();

// Rotte pubbliche
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Rotte protette (richiedono autenticazione)
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
