import { Router } from 'express';
import { getRepos } from '../controllers/github/getRepos';
import { syncRepos } from '../controllers/github/syncRepos';
import { deleteProject } from '../controllers/projects/deleteProject';
import { getAllProjects } from '../controllers/projects/getAllProjects';
import { getProjectById } from '../controllers/projects/getProjectById';
import { createProject } from '../controllers/projects/createProject';
import { updateProject } from '../controllers/projects/updateProject';
import usersRoutes from './users';

const router = Router();

// Rotte Projects
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Rotte GitHub
router.get('/github/repos', getRepos);
router.put('/github/sync', ...syncRepos);

// Rotte Users
router.use('/users', usersRoutes);

export default router;
