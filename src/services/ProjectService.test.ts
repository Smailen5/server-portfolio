import fs from "fs";
import path from "path";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { env } from "../config/index.js";
import { createProjectService } from "./ProjectService.js";
import { Project } from "../models/Projects.js";

describe("ProjectService", () => {
  let projectService: ReturnType<typeof createProjectService>;

  beforeEach(() => {
    vi.clearAllMocks();
    projectService = createProjectService();
  });

  describe("create", () => {
    it("crea un nuovo progetto con i dati forniti", async () => {
      const projectData = {
        name: "test-project",
        description: "Test description",
        technologies: ["react", "typescript"],
      };
      const createdProject = { _id: "123", ...projectData };
      vi.spyOn(Project, "create").mockResolvedValue(createdProject as any);

      const result = await projectService.create(projectData);

      expect(Project.create).toHaveBeenCalledWith(projectData);
      expect(result).toEqual(createdProject);
    });

    it("propaga gli errori di Mongoose", async () => {
      const error = new Error("Validation failed");
      vi.spyOn(Project, "create").mockRejectedValue(error);

      await expect(projectService.create({ name: "test" })).rejects.toThrow(
        error
      );
    });
  });

  describe("getAll", () => {
    it("recupera tutti i progetti ordinati per createdAt decrescente", async () => {
      const projects = [
        { _id: "1", name: "project-1" },
        { _id: "2", name: "project-2" },
      ];
      const sortMock = vi.fn().mockResolvedValue(projects);
      vi.spyOn(Project, "find").mockReturnValue({ sort: sortMock } as any);

      const result = await projectService.getAll();

      expect(Project.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(projects);
    });

    it("propaga gli errori di Mongoose", async () => {
      const error = new Error("Database error");
      vi.spyOn(Project, "find").mockImplementation(() => {
        throw error;
      });

      await expect(projectService.getAll()).rejects.toThrow(error);
    });
  });

  describe("getById", () => {
    it("recupera un progetto per ID", async () => {
      const project = { _id: "123", name: "test-project" };
      vi.spyOn(Project, "findOne").mockResolvedValue(project as any);

      const result = await projectService.getById("123");

      expect(Project.findOne).toHaveBeenCalledWith({ _id: "123" });
      expect(result).toEqual(project);
    });

    it("restituisce null quando il progetto non esiste", async () => {
      vi.spyOn(Project, "findOne").mockResolvedValue(null);

      const result = await projectService.getById("999");

      expect(result).toBeNull();
    });

    it("propaga gli errori di Mongoose", async () => {
      const error = new Error("Database error");
      vi.spyOn(Project, "findOne").mockRejectedValue(error);

      await expect(projectService.getById("123")).rejects.toThrow(error);
    });
  });

  describe("update", () => {
    it("aggiorna un progetto esistente", async () => {
      const updateData = { description: "Updated description" };
      const updatedProject = {
        _id: "123",
        name: "test-project",
        ...updateData,
      };
      vi.spyOn(Project, "findOneAndUpdate").mockResolvedValue(
        updatedProject as any
      );

      const result = await projectService.update("123", updateData);

      expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "123" },
        updateData,
        { returnDocument: "after" }
      );
      expect(result).toEqual(updatedProject);
    });

    it("restituisce null quando il progetto non esiste", async () => {
      vi.spyOn(Project, "findOneAndUpdate").mockResolvedValue(null);

      const result = await projectService.update("999", { name: "updated" });

      expect(result).toBeNull();
    });

    it("propaga gli errori di Mongoose", async () => {
      const error = new Error("Database error");
      vi.spyOn(Project, "findOneAndUpdate").mockRejectedValue(error);

      await expect(
        projectService.update("123", { name: "updated" })
      ).rejects.toThrow(error);
    });
  });

  describe("delete", () => {
    it("elimina un progetto esistente", async () => {
      const deletedProject = { _id: "123", name: "test-project" };
      vi.spyOn(Project, "findOneAndDelete").mockResolvedValue(
        deletedProject as any
      );

      const result = await projectService.delete("123");

      expect(Project.findOneAndDelete).toHaveBeenCalledWith({ _id: "123" });
      expect(result).toEqual(deletedProject);
    });

    it("elimina i file immagine associati al progetto", async () => {
      const deletedProject = {
        _id: "123",
        name: "test-project",
        images: ["/screenshots/test-1.webp", "/screenshots/test-2.webp"],
      };
      vi.spyOn(Project, "findOneAndDelete").mockResolvedValue(
        deletedProject as any
      );
      const unlinkSpy = vi
        .spyOn(fs.promises, "unlink")
        .mockResolvedValue(undefined);

      const result = await projectService.delete("123");

      expect(unlinkSpy).toHaveBeenCalledTimes(2);
      expect(unlinkSpy).toHaveBeenCalledWith(
        path.join(env.screenshotsDir, "test-1.webp")
      );
      expect(unlinkSpy).toHaveBeenCalledWith(
        path.join(env.screenshotsDir, "test-2.webp")
      );
      expect(result).toEqual(deletedProject);
    });

    it("continua l'eliminazione se un file immagine non esiste", async () => {
      const deletedProject = {
        _id: "123",
        name: "test-project",
        images: ["/screenshots/missing.webp"],
      };
      vi.spyOn(Project, "findOneAndDelete").mockResolvedValue(
        deletedProject as any
      );
      const error = new Error("ENOENT: no such file or directory");
      const unlinkSpy = vi
        .spyOn(fs.promises, "unlink")
        .mockRejectedValue(error);

      await expect(projectService.delete("123")).resolves.toEqual(
        deletedProject
      );
      expect(unlinkSpy).toHaveBeenCalledTimes(1);
    });

    it("restituisce null quando il progetto non esiste", async () => {
      vi.spyOn(Project, "findOneAndDelete").mockResolvedValue(null);

      const result = await projectService.delete("999");

      expect(result).toBeNull();
    });

    it("propaga gli errori di Mongoose", async () => {
      const error = new Error("Database error");
      vi.spyOn(Project, "findOneAndDelete").mockRejectedValue(error);

      await expect(projectService.delete("123")).rejects.toThrow(error);
    });
  });

  describe("upsert", () => {
    it("crea un nuovo progetto quando non esiste", async () => {
      const projectData = {
        name: "new-project",
        description: "New project",
        images: ["https://example.com/image.webp"],
        technologies: ["react"],
        createdAt: new Date("2024-01-01"),
        readme: "# README",
      };
      const createdProject = { _id: "123", ...projectData };
      vi.spyOn(Project, "findOne").mockResolvedValue(null);
      vi.spyOn(Project, "create").mockResolvedValue(createdProject as any);

      const result = await projectService.upsert("new-project", projectData);

      expect(Project.findOne).toHaveBeenCalledWith({ repoName: "new-project" });
      expect(Project.create).toHaveBeenCalledWith(projectData);
      expect(Project.findOneAndUpdate).not.toHaveBeenCalled();
      expect(result).toEqual(createdProject);
    });

    it("aggiorna un progetto esistente escludendo createdAt", async () => {
      const existingProject = {
        _id: "123",
        name: "existing-project",
        description: "Old description",
        repoUrl: "",
        createdAt: new Date("2024-01-01"),
      };
      const updateData = {
        name: "existing-project",
        description: "Updated description",
        repoUrl: "https://github.com/test/existing-project",
        images: ["https://example.com/image.webp"],
        technologies: ["react"],
        createdAt: new Date("2024-12-31"),
        readme: "# README",
      };
      const { createdAt: _, ...updateDataWithoutCreatedAt } = updateData;
      const updatedProject = { _id: "123", ...updateData };
      vi.spyOn(Project, "findOne").mockResolvedValue(existingProject as any);
      vi.spyOn(Project, "findOneAndUpdate").mockResolvedValue(
        updatedProject as any
      );

      const result = await projectService.upsert(
        "existing-project",
        updateData
      );

      expect(Project.findOne).toHaveBeenCalledWith({
        repoName: "existing-project",
      });
      expect(Project.create).not.toHaveBeenCalled();
      expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
        { repoName: "existing-project" },
        updateDataWithoutCreatedAt,
        { returnDocument: "after" }
      );
      expect(result).toEqual(updatedProject);
    });

    it("gestisce la race condition quando findOne restituisce null ma create fallisce per chiave duplicata", async () => {
      const projectData = {
        name: "race-project",
        description: "Race condition project",
      };
      const duplicateError = new Error(
        "E11000 duplicate key error collection: test.projects index: name_1"
      );
      vi.spyOn(Project, "findOne").mockResolvedValue(null);
      vi.spyOn(Project, "create").mockRejectedValue(duplicateError);

      await expect(
        projectService.upsert("race-project", projectData)
      ).rejects.toThrow(duplicateError);

      expect(Project.findOne).toHaveBeenCalledWith({
        repoName: "race-project",
      });
      expect(Project.create).toHaveBeenCalledWith(projectData);
    });

    it("propaga gli errori di Mongoose durante l'aggiornamento", async () => {
      const existingProject = { _id: "123", name: "existing-project" };
      const error = new Error("Database error");
      vi.spyOn(Project, "findOne").mockResolvedValue(existingProject as any);
      vi.spyOn(Project, "findOneAndUpdate").mockRejectedValue(error);

      await expect(
        projectService.upsert("existing-project", { name: "existing-project" })
      ).rejects.toThrow(error);
    });
  });
});
