import { describe, expect, it, vi } from "vitest";
import { Octokit } from "octokit";
import { createGitHubService } from "./GitHubService.js";

type MockedOctokit = {
  rest: {
    repos: {
      listForAuthenticatedUser: ReturnType<typeof vi.fn>;
      getContent: ReturnType<typeof vi.fn>;
    };
  };
};

const createMockOctokit = (): MockedOctokit => ({
  rest: {
    repos: {
      listForAuthenticatedUser: vi.fn(),
      getContent: vi.fn(),
    },
  },
});

describe("GitHubService", () => {
  describe("getRepositories", () => {
    it("recupera i repo filtrati per prefisso", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.listForAuthenticatedUser.mockResolvedValueOnce({
        data: [
          {
            name: "fm-project-1",
            html_url: "https://github.com/Smailen5/fm-project-1",
            description: "First project",
          },
          {
            name: "other-project",
            html_url: "https://github.com/Smailen5/other-project",
            description: null,
          },
          {
            name: "fm-project-2",
            html_url: "https://github.com/Smailen5/fm-project-2",
            description: "Second project",
          },
        ],
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getRepositories(["fm-"]);

      expect(result).toEqual([
        {
          name: "fm-project-1",
          html_url: "https://github.com/Smailen5/fm-project-1",
          description: "First project",
        },
        {
          name: "fm-project-2",
          html_url: "https://github.com/Smailen5/fm-project-2",
          description: "Second project",
        },
      ]);
      expect(octokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledTimes(
        1
      );
      expect(octokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledWith({
        per_page: 100,
        page: 1,
      });
    });

    it("gestisce la paginazione quando la prima pagina è piena", async () => {
      const octokit = createMockOctokit();
      const firstPage = Array.from({ length: 100 }, (_, i) => ({
        name: `fm-project-${i}`,
        html_url: `https://github.com/Smailen5/fm-project-${i}`,
        description: null,
      }));
      octokit.rest.repos.listForAuthenticatedUser.mockResolvedValueOnce({
        data: firstPage,
      });
      octokit.rest.repos.listForAuthenticatedUser.mockResolvedValueOnce({
        data: [
          {
            name: "fm-last",
            html_url: "https://github.com/Smailen5/fm-last",
            description: null,
          },
        ],
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getRepositories(["fm-"]);

      expect(result).toHaveLength(101);
      expect(octokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledTimes(
        2
      );
    });

    it("restituisce un array vuoto quando non ci sono repo", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.listForAuthenticatedUser.mockResolvedValueOnce({
        data: [],
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getRepositories(["fm-"]);

      expect(result).toEqual([]);
      expect(octokit.rest.repos.listForAuthenticatedUser).toHaveBeenCalledTimes(
        1
      );
    });

    it("filtra repo con prefissi multipli", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.listForAuthenticatedUser.mockResolvedValueOnce({
        data: [
          {
            name: "fm-project-1",
            html_url: "https://github.com/Smailen5/fm-project-1",
            description: "Frontend Mentor",
          },
          {
            name: "pm-project-1",
            html_url: "https://github.com/Smailen5/pm-project-1",
            description: "Project Manager",
          },
          {
            name: "other-project",
            html_url: "https://github.com/Smailen5/other-project",
            description: "Should be excluded",
          },
        ],
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getRepositories(["fm-", "pm-"]);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          name: "fm-project-1",
          html_url: "https://github.com/Smailen5/fm-project-1",
          description: "Frontend Mentor",
        },
        {
          name: "pm-project-1",
          html_url: "https://github.com/Smailen5/pm-project-1",
          description: "Project Manager",
        },
      ]);
    });

    it("propaga gli errori di rete", async () => {
      const octokit = createMockOctokit();
      const error = new Error("Network error");
      octokit.rest.repos.listForAuthenticatedUser.mockRejectedValueOnce(error);
      const service = createGitHubService(octokit as unknown as Octokit);

      await expect(service.getRepositories(["fm-"])).rejects.toThrow(error);
    });
  });

  describe("getPackageJson", () => {
    it("legge e parsifica il package.json", async () => {
      const octokit = createMockOctokit();
      const packageJson = {
        name: "project",
        description: "A project",
        technologies: ["react"],
      };
      const content = Buffer.from(JSON.stringify(packageJson)).toString(
        "base64"
      );
      octokit.rest.repos.getContent.mockResolvedValueOnce({
        data: { content },
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getPackageJson("fm-project");

      expect(octokit.rest.repos.getContent).toHaveBeenCalledWith({
        owner: "Smailen5",
        repo: "fm-project",
        path: "package.json",
      });
      expect(result).toEqual(packageJson);
    });

    it("restituisce null quando il contenuto è un array", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockResolvedValueOnce({ data: [] });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getPackageJson("fm-project");

      expect(result).toBeNull();
    });

    it("restituisce null quando il contenuto non ha la proprietà content", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockResolvedValueOnce({
        data: { html_url: "https://example.com" },
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getPackageJson("fm-project");

      expect(result).toBeNull();
    });

    it("restituisce null quando la risposta è 404", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockRejectedValueOnce({ status: 404 });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getPackageJson("fm-project");

      expect(result).toBeNull();
    });
  });

  describe("getScreenshots", () => {
    it("restituisce gli URL dei file nella cartella screenshots", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockResolvedValueOnce({
        data: [
          { type: "file", download_url: "https://example.com/desktop.png" },
          { type: "dir", download_url: "https://example.com/folder" },
          { type: "file", download_url: "https://example.com/mobile.png" },
        ],
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getScreenshots("fm-project");

      expect(result).toEqual([
        "https://example.com/desktop.png",
        "https://example.com/mobile.png",
      ]);
    });

    it("restituisce un array vuoto quando la risposta non è un array", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockResolvedValueOnce({
        data: { content: "ignored" },
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getScreenshots("fm-project");

      expect(result).toEqual([]);
    });

    it("restituisce un array vuoto quando la risposta è 404", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockRejectedValueOnce({ status: 404 });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getScreenshots("fm-project");

      expect(result).toEqual([]);
    });
  });

  describe("getReadme", () => {
    it("legge e decodifica il README", async () => {
      const octokit = createMockOctokit();
      const readme = "# README\n\nDescription";
      const content = Buffer.from(readme).toString("base64");
      octokit.rest.repos.getContent.mockResolvedValueOnce({
        data: { content },
      });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getReadme("fm-project");

      expect(octokit.rest.repos.getContent).toHaveBeenCalledWith({
        owner: "Smailen5",
        repo: "fm-project",
        path: "README.md",
      });
      expect(result).toBe(readme);
    });

    it("restituisce null quando il contenuto è un array", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockResolvedValueOnce({ data: [] });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getReadme("fm-project");

      expect(result).toBeNull();
    });

    it("restituisce null quando il README non è trovato", async () => {
      const octokit = createMockOctokit();
      octokit.rest.repos.getContent.mockRejectedValueOnce({ status: 404 });
      const service = createGitHubService(octokit as unknown as Octokit);

      const result = await service.getReadme("fm-project");

      expect(result).toBeNull();
    });
  });
});
