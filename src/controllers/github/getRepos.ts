import { NextFunction, Request, RequestHandler, Response } from 'express';
import { env } from '../../config/index.js';
import { AppError } from '../../middleware/index.js';
import { createGitHubService } from '../../services/GitHubService.js';
import { cache } from '../../utils/cache.js';
import { getOctokitInstance } from '../../utils/octokit.js';

const CACHE_KEY = 'github:repos';
const CACHE_TTL = 5 * 60 * 1000;

interface PackageInfo {
  name: string;
  description: string;
  url: string;
  technologies: string[];
  updated_at: string;
}

export const getRepos = (async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!env.githubToken) {
      return next(new AppError('Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env', 500));
    }

    const cached = cache.get<PackageInfo[]>(CACHE_KEY);
    if (cached) {
      return res.json(cached);
    }

    const github = createGitHubService(getOctokitInstance());
    const packageFolders = await github.getRepositories();

    const packagesInfo = await Promise.all(
      packageFolders.map(async (folder) => {
        const packageData = await github.getPackageJson(folder);

        return {
          name: packageData?.name || folder.name,
          description: packageData?.description || '',
          url: folder.html_url,
          technologies: packageData?.technologies || [],
          updated_at: packageData?.createdAt || new Date().toISOString(),
        };
      })
    );

    cache.set(CACHE_KEY, packagesInfo, CACHE_TTL);
    return res.json(packagesInfo);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sconosciuto';
    return next(new AppError(message, 500));
  }
}) as unknown as RequestHandler;
