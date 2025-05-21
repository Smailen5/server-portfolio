import { Router } from 'express';
import { deleteProject } from './delete/deleteProject';
import { getAllProjects } from './get/getAllProjects';
import { getProjectById } from './get/getProjectById';
import { createProject } from './post/createProject';
import { updateProject } from './put/updateProject';

const router = Router();

// Rotte pubbliche
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Rotte protette (richiedono autenticazione)
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
