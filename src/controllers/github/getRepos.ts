import { Request, RequestHandler, Response } from 'express';
import { env } from '../../config/index.js';
import { createGitHubService } from '../../services/GitHubService.js';
import { getOctokitInstance } from '../../utils/octokit.js';

export const getRepos = (async (_req: Request, res: Response) => {
  try {
    if (!env.githubToken) {
      return res.status(500).json({
        message:
          'Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env',
      });
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

    return res.json(packagesInfo);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler;
