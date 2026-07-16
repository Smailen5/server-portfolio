import { Octokit } from "octokit";
import { GitHubRepo, PackageJson } from "../types/index.js";

const OWNER = "Smailen5";

export function createGitHubService(octokit: Octokit) {
  return {
    getRepositories: async (prefixes: string[]): Promise<GitHubRepo[]> => {
      let allRepos: GitHubRepo[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const { data: repos } =
          await octokit.rest.repos.listForAuthenticatedUser({
            per_page: perPage,
            page: page,
          });

        if (repos.length === 0) break;

        const filteredRepos = repos
          .filter((repo) =>
            prefixes.some((prefix) => repo.name.startsWith(prefix))
          )
          .map((repo) => ({
            name: repo.name,
            html_url: repo.html_url,
            description: repo.description,
          }));

        allRepos = [...allRepos, ...filteredRepos];
        page++;

        if (repos.length < perPage) break;
      }

      return allRepos;
    },

    getPackageJson: async (repoName: string): Promise<PackageJson | null> => {
      try {
        const { data: packageJson } = await octokit.rest.repos.getContent({
          owner: OWNER,
          repo: repoName,
          path: "package.json",
        });

        if ("content" in packageJson && !Array.isArray(packageJson)) {
          const content = Buffer.from(packageJson.content, "base64").toString();
          return JSON.parse(content);
        }
        return null;
      } catch (_error) {
        return null;
      }
    },

    getScreenshots: async (repoName: string): Promise<string[]> => {
      try {
        const { data: screenshots } = await octokit.rest.repos.getContent({
          owner: OWNER,
          repo: repoName,
          path: "screenshots",
        });

        if (!Array.isArray(screenshots)) {
          return [];
        }

        return screenshots
          .filter((item) => item.type === "file")
          .map((item) => item.download_url)
          .filter((url): url is string => typeof url === "string");
      } catch (_error) {
        return [];
      }
    },

    getReadme: async (repoName: string): Promise<string | null> => {
      try {
        const { data: readme } = await octokit.rest.repos.getContent({
          owner: OWNER,
          repo: repoName,
          path: "README.md",
        });

        if ("content" in readme && !Array.isArray(readme)) {
          return Buffer.from(readme.content, "base64").toString();
        }
        return null;
      } catch (_error) {
        return null;
      }
    },
  };
}

export type GitHubService = ReturnType<typeof createGitHubService>;
