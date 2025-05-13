import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Octokit } from 'octokit';
import Project from '../../models/Project';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface GitHubContent {
  name: string;
  path: string;
  type: string;
  html_url: string;
  updated_at: string;
}

export const syncRepos = async (_req: Request, res: Response) => {
  try {
    if (!process.env.GITHUB_TOKEN) {
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

    const packageFolders = allPackages.filter(
      (item: GitHubContent) => item.type === 'dir'
    );

    let syncedCount = 0;

    for (const folder of packageFolders) {
      try {
        const { data: packageJson } = await octokit.rest.repos.getContent({
          owner: 'Smailen5',
          repo: 'Frontend-mentor-challenge',
          path: `${folder.path}/package.json`,
        });

        if ('content' in packageJson) {
          const content = Buffer.from(packageJson.content, 'base64').toString();
          const packageData = JSON.parse(content);

          const projectData = {
            name: packageData.name || folder.name,
            description: packageData.description || '',
            link: folder.html_url,
            image: '', // Puoi aggiungere un'immagine di default o lasciare vuoto
            technologies: packageData.dependencies
              ? Object.keys(packageData.dependencies)
              : [],
          };

          // Controlliamo se il progetto esiste già
          const [project, created] = await Project.findOrCreate({
            where: { name: projectData.name },
            defaults: projectData,
          });

          if (!created) {
            // Aggiorniamo il progetto esistente
            await project.update(projectData);
          }

          syncedCount++;
        }
      } catch (error) {
        console.error(
          `Errore nel recupero del package.json per ${folder.name}:`,
          error
        );
      }
    }

    return res.json({
      message: `Sincronizzati ${syncedCount} progetti con successo`,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
