import { Octokit } from 'octokit';
import { GitHubContent, PackageJson } from '../types';

export const getProjectsFromGithub = async (octokit: Octokit) => {
  let allPackages: GitHubContent[] = [];
  let page = 1;
  const perPage = 100;

  // Recuperiamo tutti i contenuti della cartella packages con paginazione
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

    // Se riceviamo meno risultati del per_page, abbiamo finito
    if (packages.length < perPage) break;
  }

  // Filtriamo solo le cartelle (escludiamo file come .gitkeep)
  return allPackages.filter((item: GitHubContent) => item.type === 'dir');
};

export const getPackageJson = async (
  octokit: Octokit,
  folder: GitHubContent
): Promise<PackageJson | null> => {
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
  } catch (error) {
    return null;
  }
};

export const getScreenshot = async (
  octokit: Octokit,
  folderName: string
): Promise<string | null> => {
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
  } catch (error) {
    return null;
  }
};

export const getReadme = async (
  octokit: Octokit,
  folder: GitHubContent
): Promise<string | null> => {
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
  } catch (error) {
    return null;
  }
};
