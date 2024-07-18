const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project non found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new project
router.post("/", async (req, res) => {
  const project = new Project({
    name: req.body.name,
    linK: req.body.link,
    image: req.body.image,
    technologies: req.body.technologies,
    description: req.body.description,
  });
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
