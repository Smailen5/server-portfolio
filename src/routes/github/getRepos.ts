import { Request, RequestHandler, Response } from 'express';
import { Octokit } from 'octokit';
import { env } from '../../config/env';

const octokit = new Octokit({
  auth: env.githubToken,
});

interface GitHubContent {
  name: string;
  path: string;
  type: string;
  html_url: string;
  updated_at: string;
}

export const getRepos = (async (_req: Request, res: Response) => {
  try {
    if (!env.githubToken) {
      return res.status(500).json({
        message:
          'Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env',
      });
    }

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
    const packageFolders = allPackages.filter(
      (item: GitHubContent) => item.type === 'dir'
    );

    // Per ogni cartella, otteniamo i dettagli del package.json
    const packagesInfo = await Promise.all(
      packageFolders.map(async (folder: GitHubContent) => {
        try {
          const { data: packageJson } = await octokit.rest.repos.getContent({
            owner: 'Smailen5',
            repo: 'Frontend-mentor-challenge',
            path: `${folder.path}/package.json`,
          });

          if ('content' in packageJson) {
            const content = Buffer.from(
              packageJson.content,
              'base64'
            ).toString();
            const packageData = JSON.parse(content);

            return {
              name: packageData.name || folder.name,
              description: packageData.description || '',
              url: folder.html_url,
              technologies: packageData.dependencies
                ? Object.keys(packageData.dependencies)
                : [],
              updated_at: packageJson.updated_at,
            };
          }
        } catch (error) {
          // Se non troviamo il package.json, restituiamo comunque le informazioni base
          return {
            name: folder.name,
            description: '',
            url: folder.html_url,
            technologies: [],
            updated_at: folder.updated_at,
          };
        }
      })
    );

    return res.json(packagesInfo);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}) as unknown as RequestHandler;
