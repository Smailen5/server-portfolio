import { Router } from 'express';
import { deleteProject } from './delete/deleteProject';
import { getAllProjects } from './get/getAllProjects';
import { getProjectById } from './get/getProjectById';
import { createProject } from './post/createProject';
import { updateProject } from './put/updateProject';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
