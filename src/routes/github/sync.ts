import { Request, Response } from 'express';
import { Octokit } from 'octokit';
import { env } from '../../config/env';
import { syncValidator } from '../../middleware/validators';
import { validateRequest } from '../../middleware/validatorsRequest';
import Project from '../../models/Project';

const octokit = new Octokit({
  auth: env.githubToken,
});

interface GitHubContent {
  name: string;
  path: string;
  type: string;
  html_url: string;
  updated_at: string;
  download_url?: string;
  content?: string;
}

interface PackageJson {
  name: string;
  description: string;
  technologies: string[];
}

export const syncRepos = [
  syncValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      if (!env.githubToken) {
        return res.status(500).json({
          message:
            'Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env',
          errors: [],
        });
      }

      // Recuperiamo i contenuti della cartella packages
      const { data: packages } = await octokit.rest.repos.getContent({
        owner: 'Smailen5',
        repo: 'Frontend-mentor-challenge',
        path: 'packages',
      });

      if (!Array.isArray(packages)) {
        return res.status(404).json({
          message: 'La cartella packages non è stata trovata',
          errors: [],
        });
      }

      // Filtriamo solo le cartelle (escludiamo file come .gitkeep)
      const packageFolders = packages.filter(
        (item: GitHubContent) => item.type === 'dir'
      );

      // console.log(
      //   'Progetti trovati:',
      //   packageFolders.map((folder) => folder.name)
      // );

      let syncedCount = 0;
      let errors: string[] = [];

      for (const folder of packageFolders) {
        try {
          let projectData = {
            name: folder.name,
            description: '',
            image: '', // Verrà aggiornato con l'immagine di anteprima
            technologies: [] as string[],
            readme: '',
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
            errors.push(
              `Nessuna immagine di anteprima trovata per ${folder.name}: ${error.message}`
            );
          }

          // Recuperiamo il README.md
          try {
            const { data: readme } = await octokit.rest.repos.getContent({
              owner: 'Smailen5',
              repo: 'Frontend-mentor-challenge',
              path: `${folder.path}/README.md`,
            });

            if ('content' in readme) {
              const content = Buffer.from(readme.content, 'base64').toString();
              projectData.readme = content;
            }
          } catch (error: any) {
            errors.push(
              `Nessun README.md trovato per ${folder.name}: ${error.message}`
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
            errors.push(
              `Nessun package.json trovato per ${folder.name}: ${error.message}`
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
          errors.push(errorMessage);
        }
      }

      // Se non è stato sincronizzato nessun progetto, restituiamo un errore
      if (syncedCount === 0) {
        return res.status(500).json({
          message: 'Nessun progetto è stato sincronizzato con successo',
          errors: errors,
        });
      }

      return res.json({
        message: `Sincronizzati ${syncedCount} progetti con successo`,
        totalProjects: packageFolders.length,
        syncedProjects: syncedCount,
        errors: errors,
        projects: packageFolders.map((folder) => folder.name),
      });
    } catch (err: any) {
      return res.status(500).json({
        message: err.message,
        errors: [],
      });
    }
  },
];
