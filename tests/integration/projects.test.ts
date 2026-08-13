import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { mapProjectToResponse } from "../../src/utils/projectMapper.js";

const { mockProjectService } = vi.hoisted(() => ({
  mockProjectService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("../../src/services/ProjectService.js", () => ({
  createProjectService: vi.fn(() => mockProjectService),
}));

const mockEnv = vi.hoisted(() => ({
  apiKey: "TestApiKey1234567890",
  jwtSecret: "test-jwt-secret",
  githubToken: "test-github-token",
  projectPrefixes: ["fm-"],
  screenshotsDir: "./tmp/screenshots",
  port: 3000,
  mongoUri: "mongodb://localhost:27017/test",
  logLevel: "info",
  logDir: "./logs",
  rateLimitWindowMs: 900000,
  rateLimitMax: 100,
  corsOrigin: "*",
}));

vi.mock("../../src/config/index.js", () => ({
  env: mockEnv,
}));

vi.mock("../../src/config/env.js", () => ({
  env: mockEnv,
}));

vi.mock("../../src/config/appLogger.js", () => ({
  appLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { createTestApp } from "../helpers/testApp.js";
import { IProject } from "../../src/models/Projects.js";

const app = createTestApp();

const validToken = jwt.sign({ id: "test-user-id" }, mockEnv.jwtSecret, {
  expiresIn: "1h",
});

const authHeaders = {
  "x-api-key": mockEnv.apiKey,
  Authorization: `Bearer ${validToken}`,
};

describe("Route /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/projects", () => {
    it("ritorna lista progetti (route pubblica)", async () => {
      const projects = [
        {
          _id: "1",
          name: "Project 1",
          description: "Desc 1",
          images: [],
          technologies: ["react"],
          repoUrl: "",
          version: "",
          createdAt: String(new Date("2026-01-01")),
          updatedAt: new Date("2026-01-01"),
          readme: "",
        },
        {
          _id: "2",
          name: "Project 2",
          description: "Desc 2",
          images: [],
          technologies: ["vue"],
          repoUrl: "",
          version: "",
          createdAt: String(new Date("2026-01-01")),
          updatedAt: new Date("2026-01-01"),
          readme: "",
        },
      ];

      const expectedResponse = projects.map((p) =>
        mapProjectToResponse(p as unknown as IProject)
      );
      mockProjectService.getAll.mockResolvedValue(projects);

      const response = await request(app).get("/api/projects");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
      expect(mockProjectService.getAll).toHaveBeenCalled();
    });

    it("ritorna array vuoto quando non ci sono progetti", async () => {
      mockProjectService.getAll.mockResolvedValue([]);

      const response = await request(app).get("/api/projects");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/projects/:id", () => {
    it("ritorna un progetto per ID (route pubblica)", async () => {
      const project = {
        _id: "507f1f77bcf86cd799439011",
        name: "Test Project",
        description: "Test description",
        images: [],
        technologies: ["react"],
        repoUrl: "https://github.com/test/respo",
        version: "0.0.1",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
        readme: "test readme",
      };

      const expectedResponse = mapProjectToResponse(
        project as unknown as IProject
      );

      mockProjectService.getById.mockResolvedValue(project);

      const response = await request(app).get(
        "/api/projects/507f1f77bcf86cd799439011"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it("ritorna 404 quando il progetto non esiste", async () => {
      mockProjectService.getById.mockResolvedValue(null);

      const response = await request(app).get(
        "/api/projects/507f1f77bcf86cd799439011"
      );

      expect(response.status).toBe(404);
    });

    it("ritorna 400 per ID non valido", async () => {
      const response = await request(app).get("/api/projects/invalid-id");

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/projects", () => {
    it("richiede autenticazione", async () => {
      const response = await request(app)
        .post("/api/projects")
        .send({
          name: "New Project",
          repoUrl: "https://example.com",
          images: ["https://example.com/img.png"],
          technologies: ["react"],
          description: "Description",
        });

      expect(response.status).toBe(401);
      expect(mockProjectService.create).not.toHaveBeenCalled();
    });

    it("crea un progetto con autenticazione valida", async () => {
      const projectData = {
        name: "New Project",
        repoUrl: "https://example.com",
        images: ["https://example.com/img.png"],
        technologies: ["react"],
        description: "Description",
      };
      const createdProject = { _id: "123", ...projectData };
      mockProjectService.create.mockResolvedValue(createdProject);

      const response = await request(app)
        .post("/api/projects")
        .set(authHeaders)
        .send(projectData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdProject);
      expect(mockProjectService.create).toHaveBeenCalledWith(projectData);
    });

    it("valida i campi obbligatori", async () => {
      const response = await request(app)
        .post("/api/projects")
        .set(authHeaders)
        .send({});

      expect(response.status).toBe(400);
      expect(mockProjectService.create).not.toHaveBeenCalled();
    });
  });

  describe("PUT /api/projects/:id", () => {
    it("richiede autenticazione", async () => {
      const response = await request(app)
        .put("/api/projects/507f1f77bcf86cd799439011")
        .send({ description: "Updated" });

      expect(response.status).toBe(401);
    });

    it("aggiorna un progetto con autenticazione valida", async () => {
      const updateData = { description: "Updated description" };
      const updatedProject = {
        _id: "507f1f77bcf86cd799439011",
        name: "Test",
        ...updateData,
      };
      mockProjectService.update.mockResolvedValue(updatedProject);

      const response = await request(app)
        .put("/api/projects/507f1f77bcf86cd799439011")
        .set(authHeaders)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProject);
    });

    it("ritorna 400 per ID non valido", async () => {
      const response = await request(app)
        .put("/api/projects/invalid-id")
        .set(authHeaders)
        .send({ description: "Updated" });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/projects/:id", () => {
    it("richiede autenticazione", async () => {
      const response = await request(app).delete(
        "/api/projects/507f1f77bcf86cd799439011"
      );

      expect(response.status).toBe(401);
    });

    it("elimina un progetto con autenticazione valida", async () => {
      const deletedProject = {
        _id: "507f1f77bcf86cd799439011",
        name: "Test",
      };
      mockProjectService.delete.mockResolvedValue(deletedProject);

      const response = await request(app)
        .delete("/api/projects/507f1f77bcf86cd799439011")
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Project eliminato" });
      expect(mockProjectService.delete).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011"
      );
    });

    it("ritorna 400 per ID non valido", async () => {
      const response = await request(app)
        .delete("/api/projects/invalid-id")
        .set(authHeaders);

      expect(response.status).toBe(400);
    });
  });
});
