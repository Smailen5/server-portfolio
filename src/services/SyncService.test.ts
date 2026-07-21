import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockGitHubService, mockImageService, mockProjectService, mockCache } =
  vi.hoisted(() => ({
    mockGitHubService: {
      getRepositories: vi.fn(),
      getPackageJson: vi.fn(),
      getScreenshots: vi.fn(),
      getReadme: vi.fn(),
    },
    mockImageService: {
      downloadAndConvert: vi.fn(),
    },
    mockProjectService: {
      upsert: vi.fn(),
    },
    mockCache: {
      invalidate: vi.fn(),
    },
  }));

vi.mock("./GitHubService.js", () => ({
  createGitHubService: vi.fn(() => mockGitHubService),
}));

vi.mock("./ImageService.js", () => ({
  createImageService: vi.fn(() => mockImageService),
}));

vi.mock("./ProjectService.js", () => ({
  createProjectService: vi.fn(() => mockProjectService),
}));

vi.mock("../utils/cache.js", () => ({
  cache: mockCache,
}));

vi.mock("../utils/octokit.js", () => ({
  getOctokitInstance: vi.fn(() => ({})),
}));

vi.mock("../config/appLogger.js", () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const mockEnv = vi.hoisted(() => ({
  projectPrefixes: ["fm-"],
}));

vi.mock("../config/index.js", () => ({
  env: mockEnv,
}));

import { createSyncService } from "./SyncService.js";

describe("SyncService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImageService.downloadAndConvert.mockResolvedValue(null);
  });

  describe("syncAll", () => {
    it("sincronizza repo valide con successo", async () => {
      mockGitHubService.getRepositories.mockResolvedValue([
        {
          name: "fm-project-1",
          html_url: "https://github.com/fm-project-1",
          description: "Test",
        },
      ]);
      mockGitHubService.getScreenshots.mockResolvedValue([
        "https://example.com/screenshot.png",
      ]);
      mockImageService.downloadAndConvert.mockResolvedValue(
        "/screenshots/fm-project-1-screenshot.webp"
      );
      mockGitHubService.getReadme.mockResolvedValue("# README");
      mockGitHubService.getPackageJson.mockResolvedValue({
        name: "Project 1",
        description: "Desc",
        technologies: ["react"],
      });
      mockProjectService.upsert.mockResolvedValue({} as any);

      const syncService = createSyncService();
      const result = await syncService.syncAll();

      expect(result.syncedProjects).toBe(1);
      expect(result.totalProjects).toBe(1);
      expect(result.errors).toHaveLength(0);
      expect(result.projects).toEqual(["fm-project-1"]);
      expect(mockCache.invalidate).toHaveBeenCalledWith("github:repos");
    });

    it("gestisce repo senza screenshots", async () => {
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

      const syncService = createSyncService();
      const result = await syncService.syncAll();

      expect(result.syncedProjects).toBe(1);
      expect(result.errors).toContain(
        "Nessuna immagine di anteprima trovata per fm-project-1"
      );
    });

    it("gestisce repo senza readme", async () => {
      mockGitHubService.getRepositories.mockResolvedValue([
        {
          name: "fm-project-1",
          html_url: "https://github.com/fm-project-1",
          description: "Test",
        },
      ]);
      mockGitHubService.getScreenshots.mockResolvedValue([]);
      mockGitHubService.getReadme.mockResolvedValue(null);
      mockGitHubService.getPackageJson.mockResolvedValue({
        name: "Project 1",
        description: "Desc",
        technologies: ["react"],
      });
      mockProjectService.upsert.mockResolvedValue({} as any);

      const syncService = createSyncService();
      const result = await syncService.syncAll();

      expect(result.syncedProjects).toBe(1);
      expect(result.errors).toContain(
        "Nessun README.md trovato per fm-project-1"
      );
    });

    it("gestisce repo senza package.json", async () => {
      mockGitHubService.getRepositories.mockResolvedValue([
        {
          name: "fm-project-1",
          html_url: "https://github.com/fm-project-1",
          description: "Test",
        },
      ]);
      mockGitHubService.getScreenshots.mockResolvedValue([]);
      mockGitHubService.getReadme.mockResolvedValue("# README");
      mockGitHubService.getPackageJson.mockResolvedValue(null);
      mockProjectService.upsert.mockResolvedValue({} as any);

      const syncService = createSyncService();
      const result = await syncService.syncAll();

      expect(result.syncedProjects).toBe(1);
      expect(result.errors).toContain(
        "Nessun package.json trovato per fm-project-1"
      );
    });

    it("continua con altre repo quando una fallisce", async () => {
      mockGitHubService.getRepositories.mockResolvedValue([
        {
          name: "fm-project-1",
          html_url: "https://github.com/fm-project-1",
          description: "Test",
        },
        {
          name: "fm-project-2",
          html_url: "https://github.com/fm-project-2",
          description: "Test 2",
        },
      ]);
      mockGitHubService.getScreenshots
        .mockRejectedValueOnce(new Error("GitHub API error"))
        .mockResolvedValueOnce([]);
      mockGitHubService.getReadme.mockResolvedValue("# README");
      mockGitHubService.getPackageJson.mockResolvedValue({
        name: "Project 2",
        description: "Desc",
        technologies: ["vue"],
      });
      mockProjectService.upsert.mockResolvedValue({} as any);

      const syncService = createSyncService();
      const result = await syncService.syncAll();

      expect(result.syncedProjects).toBe(1);
      expect(result.totalProjects).toBe(2);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("invalida la cache dopo la sync", async () => {
      mockGitHubService.getRepositories.mockResolvedValue([]);

      const syncService = createSyncService();
      await syncService.syncAll();

      expect(mockCache.invalidate).toHaveBeenCalledWith("github:repos");
    });
  });
});
