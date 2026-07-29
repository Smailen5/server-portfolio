import { Router } from "express";
import { healthCheck } from "../../controllers/healthcheck/healthCheck.js";

const router = Router();

router.get("/", healthCheck);
export default router;
