import { describe, expect, it, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

const { mockGitHubService, mockImageService, mockProjectService, mockCache } =
  vi.hoisted(() => {
    const mockGitHubService = {
      getRepositories: vi.fn(),
      getPackageJson: vi.fn(),
      getScreenshots: vi.fn(),
      getReadme: vi.fn(),
    };

    const mockImageService = {
      downloadAndConvert: vi.fn(),
    };

    const mockProjectService = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      upsert: vi.fn(),
    };

    const mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      invalidate: vi.fn(),
      clear: vi.fn(),
    };

    return {
      mockGitHubService,
      mockImageService,
      mockProjectService,
      mockCache,
    };
  });

vi.mock("../../src/services/GitHubService.js", () => ({
  createGitHubService: vi.fn(() => mockGitHubService),
}));

vi.mock("../../src/services/ImageService.js", () => ({
  createImageService: vi.fn(() => mockImageService),
}));

vi.mock("../../src/services/ProjectService.js", () => ({
  createProjectService: vi.fn(() => mockProjectService),
}));

vi.mock("../../src/utils/cache.js", () => ({
  cache: mockCache,
}));

vi.mock("../../src/utils/octokit.js", () => ({
  getOctokitInstance: vi.fn(() => ({})),
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

const app = createTestApp();

const validToken = jwt.sign({ id: "test-user-id" }, mockEnv.jwtSecret, {
  expiresIn: "1h",
});

const authHeaders = {
  "x-api-key": mockEnv.apiKey,
  Authorization: `Bearer ${validToken}`,
};

describe("Route /api/github", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImageService.downloadAndConvert.mockResolvedValue(null);
  });

  describe("GET /api/github/repos", () => {
    it("ritorna lista repo dalla cache", async () => {
      const cachedRepos = [
        {
          name: "fm-project-1",
          description: "Test",
          url: "https://github.com/fm-project-1",
          technologies: ["react"],
          updated_at: "2024-01-01",
        },
      ];
      mockCache.get.mockReturnValue(cachedRepos);

      const response = await request(app).get("/api/github/repos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(cachedRepos);
    });

    it("ritorna lista repo da GitHub se non in cache", async () => {
      mockCache.get.mockReturnValue(null);
      mockGitHubService.getRepositories.mockResolvedValue([
        {
          name: "fm-project-1",
          html_url: "https://github.com/fm-project-1",
          description: "Test",
        },
      ]);
      mockGitHubService.getPackageJson.mockResolvedValue({
        name: "Project 1",
        description: "Desc",
        technologies: ["react"],
        createdAt: "2024-01-01",
      });

      const response = await request(app).get("/api/github/repos");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty("name", "Project 1");
    });

    it("ritorna 500 quando il token GitHub non è configurato", async () => {
      const originalToken = mockEnv.githubToken;
      mockEnv.githubToken = "";

      const response = await request(app).get("/api/github/repos");

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Token GitHub non configurato");

      mockEnv.githubToken = originalToken;
    });
  });

  describe("PUT /api/github/sync", () => {
    it("richiede API key valida", async () => {
      const response = await request(app).put("/api/github/sync");

      expect(response.status).toBe(400);
    });

    it("sincronizza repo con autenticazione valida", async () => {
      mockGitHubService.getRepositories.mockResolvedValue([
        {
          name: "fm-project-1",
          html_url: "https://github.com/fm-project-1",
          description: "Test",
        },
      ]);
      mockGitHubService.getScreenshots.mockResolvedValue([]);
      mockGitHubService.getReadme.mockResolvedValue("# README");
      mockGitHubService.getPackageJson.mockResolvedValue({
        name: "Project 1",
        description: "Desc",
        technologies: ["react"],
      });
      mockProjectService.upsert.mockResolvedValue({} as any);

      const response = await request(app)
        .put("/api/github/sync")
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("syncedProjects");
      expect(response.body.syncedProjects).toBe(1);
    });

    it("ritorna 500 quando il token GitHub non è configurato", async () => {
      const originalToken = mockEnv.githubToken;
      mockEnv.githubToken = "";

      const response = await request(app)
        .put("/api/github/sync")
        .set(authHeaders);

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Token GitHub non configurato");

      mockEnv.githubToken = originalToken;
    });
  });
});
