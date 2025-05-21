import { Router } from 'express';
import { getRepos } from './github/getRepos';
import { syncRepos } from './github/sync';
import { deleteProject } from './projects/delete/deleteProject';
import { getAllProjects } from './projects/get/getAllProjects';
import { getProjectById } from './projects/get/getProjectById';
import { createProject } from './projects/post/createProject';
import { updateProject } from './projects/put/updateProject';
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
