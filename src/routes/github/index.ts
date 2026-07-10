import { RequestHandler, Router } from "express";
import { getRepos } from "../../controllers/github/getRepos.js";
import { syncRepos } from "../../controllers/github/syncRepos.js";

const router = Router();

router.get("/repos", getRepos);
router.put("/sync", syncRepos as unknown as RequestHandler[]);

export default router;
