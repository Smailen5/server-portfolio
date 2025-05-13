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
  download_url?: string;
}

interface PackageJson {
  name: string;
  description: string;
  technologies: string[];
}

export const syncRepos = async (_req: Request, res: Response) => {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({
        message:
          'Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env',
      });
    }

    // Recuperiamo i contenuti della cartella packages
    const { data: packages } = await octokit.rest.repos.getContent({
      owner: 'Smailen5',
      repo: 'Frontend-mentor-challenge',
      path: 'packages',
    });

    if (!Array.isArray(packages)) {
      throw new Error('La cartella packages non è stata trovata');
    }

    // Filtriamo solo le cartelle (escludiamo file come .gitkeep)
    const packageFolders = packages.filter(
      (item: GitHubContent) => item.type === 'dir'
    );

    console.log(
      'Progetti trovati:',
      packageFolders.map((folder) => folder.name)
    );

    let syncedCount = 0;
    let errors: string[] = [];

    for (const folder of packageFolders) {
      try {
        let projectData = {
          name: folder.name,
          description: '',
          link: folder.html_url,
          image: '', // Verrà aggiornato con l'immagine di anteprima
          technologies: [] as string[],
        };

        // Recuperiamo l'immagine di anteprima
        try {
          const { data: screenshot } = await octokit.rest.repos.getContent({
            owner: 'Smailen5',
            repo: 'Frontend-mentor-challenge',
            path: `screen-capture/${folder.name}.webp`,
          });

          if ('download_url' in screenshot) {
            projectData.image = screenshot.download_url;
          }
        } catch (error: any) {
          console.log(
            `Nessuna immagine di anteprima trovata per ${folder.name}`
          );
        }

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
            const packageData = JSON.parse(content) as PackageJson;

            projectData = {
              ...projectData,
              name: packageData.name || folder.name,
              description: packageData.description || '',
              technologies: packageData.technologies || [],
            };
          }
        } catch (error: any) {
          console.log(
            `Nessun package.json trovato per ${folder.name}, uso i dati di base`
          );
        }

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
      } catch (error: any) {
        const errorMessage = `Errore nel recupero dei dati per ${folder.name}: ${error.message}`;
        console.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    return res.json({
      message: `Sincronizzati ${syncedCount} progetti con successo`,
      totalProjects: packageFolders.length,
      syncedProjects: syncedCount,
      errors: errors,
      projects: packageFolders.map((folder) => folder.name),
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
