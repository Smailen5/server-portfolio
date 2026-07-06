import { Octokit } from 'octokit';
import { GitHubContent, PackageJson } from '../types/index.js';

export function createGitHubService(octokit: Octokit) {
  return {
    getRepositories: async (): Promise<GitHubContent[]> => {
      let allPackages: GitHubContent[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const { data: packages } = await octokit.rest.repos.getContent({
          owner: 'Smailen5',
          repo: 'Frontend-mentor-challenge',
          path: 'packages',
          per_page: perPage,
          page: page,
        });

        if (!Array.isArray(packages)) {
          throw new Error('La cartella packages non è stata trovata');
        }

        if (packages.length === 0) break;

        allPackages = [...allPackages, ...packages];
        page++;

        if (packages.length < perPage) break;
      }

      return allPackages.filter((item: GitHubContent) => item.type === 'dir');
    },

    getPackageJson: async (folder: GitHubContent): Promise<PackageJson | null> => {
      try {
        const { data: packageJson } = await octokit.rest.repos.getContent({
          owner: 'Smailen5',
          repo: 'Frontend-mentor-challenge',
          path: `${folder.path}/package.json`,
        });

        if ('content' in packageJson) {
          const content = Buffer.from(packageJson.content, 'base64').toString();
          return JSON.parse(content);
        }
        return null;
      } catch (_error) {
        return null;
      }
    },

    getScreenshot: async (folderName: string): Promise<string | null> => {
      try {
        const { data: screenshot } = await octokit.rest.repos.getContent({
          owner: 'Smailen5',
          repo: 'Frontend-mentor-challenge',
          path: `screen-capture/${folderName}.webp`,
        });

        if ('download_url' in screenshot) {
          return screenshot.download_url;
        }
        return null;
      } catch (_error) {
        return null;
      }
    },

    getReadme: async (folder: GitHubContent): Promise<string | null> => {
      try {
        const { data: readme } = await octokit.rest.repos.getContent({
          owner: 'Smailen5',
          repo: 'Frontend-mentor-challenge',
          path: `${folder.path}/README.md`,
        });

        if ('content' in readme) {
          return Buffer.from(readme.content, 'base64').toString();
        }
        return null;
      } catch (_error) {
        return null;
      }
    },
  };
}

export type GitHubService = ReturnType<typeof createGitHubService>;
