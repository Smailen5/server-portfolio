import { Router } from 'express';
import { getRepos } from './getRepos';
import { syncRepos } from './sync';

const router = Router();

router.get('/repos', getRepos);
router.put('/sync', syncRepos as any);

export default router;
