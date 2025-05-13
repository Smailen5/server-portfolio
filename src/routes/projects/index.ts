import { Router } from 'express';
import { createProject } from './createProject';
import { deleteProject } from './deleteProject';
import { getAllProjects } from './getAllProjects';
import { getProjectById } from './getProjectById';
import { updateProject } from './updateProject';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
