import { Router } from "express";
import { createProject } from "../../controllers/projects/createProject.js";
import { deleteProject } from "../../controllers/projects/deleteProject.js";
import { getAllProjects } from "../../controllers/projects/getAllProjects.js";
import { getProjectById } from "../../controllers/projects/getProjectById.js";
import { updateProject } from "../../controllers/projects/updateProject.js";

const router = Router();

// Rotte pubbliche
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Rotte protette (richiedono autenticazione)
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
