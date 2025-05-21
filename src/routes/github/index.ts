import { Router } from 'express';
import { getRepos } from '../../controllers/github/getRepos';
import { syncRepos } from '../../controllers/github/sync';

const router = Router();

router.get('/repos', getRepos);
router.put('/sync', syncRepos as any);

export default router;
