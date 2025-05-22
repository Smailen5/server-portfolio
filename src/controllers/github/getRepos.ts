import { Request, RequestHandler, Response } from 'express';
import { Octokit } from 'octokit';
import { env } from '../../config';
import { getPackageJson, getProjectsFromGithub } from '../../utils/githubUtils';

const octokit = new Octokit({
  auth: env.githubToken,
});

export const getRepos = (async (_req: Request, res: Response) => {
  try {
    if (!env.githubToken) {
      return res.status(500).json({
        message:
          'Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env',
      });
    }

    const packageFolders = await getProjectsFromGithub(octokit);

    // Per ogni cartella, otteniamo i dettagli del package.json
    const packagesInfo = await Promise.all(
      packageFolders.map(async (folder) => {
        const packageData = await getPackageJson(octokit, folder);

        return {
          name: packageData?.name || folder.name,
          description: packageData?.description || '',
          url: folder.html_url,
          technologies: packageData?.technologies || [],
          updated_at: packageData?.createdAt || folder.updated_at,
        };
      })
    );

    return res.json(packagesInfo);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler;
