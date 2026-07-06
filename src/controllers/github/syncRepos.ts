import { Request, Response } from 'express';
import { env } from '../../config/index.js';
import { createGitHubService } from '../../services/GitHubService.js';
import { cache } from '../../utils/cache.js';
import { getOctokitInstance } from '../../utils/octokit.js';
import {
  authMiddleware,
  syncValidator,
  validateRequest,
} from '../../middleware/index.js';
import { jwtAuth } from '../../middleware/auth/jwtAuth.js';
import { createProjectService } from '../../services/ProjectService.js';
import { ProjectData } from '../../types/index.js';

export const syncRepos = [
  syncValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
  async (req: Request, res: Response) => {
    try {
      if (!env.githubToken) {
        return res.status(500).json({
          message:
            'Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env',
          errors: [],
        });
      }

      const github = createGitHubService(getOctokitInstance());
      const projectService = createProjectService();
      const packageFolders = await github.getRepositories();
      let syncedCount = 0;
      const errors: string[] = [];

      for (const folder of packageFolders) {
        try {
          let projectData: ProjectData = {
            name: folder.name,
            description: '',
            image: '', // Verrà aggiornato con l'immagine di anteprima
            technologies: [] as string[],
            createdAt: new Date(),
            readme: '',
          };

          // Recuperiamo l'immagine di anteprima
          const screenshot = await github.getScreenshot(folder.name);
          if (screenshot) {
            projectData.image = screenshot;
          } else {
            errors.push(
              `Nessuna immagine di anteprima trovata per ${folder.name}`
            );
          }

          // Recuperiamo il README.md
          const readme = await github.getReadme(folder);
          if (readme) {
            projectData.readme = readme;
          } else {
            errors.push(`Nessun README.md trovato per ${folder.name}`);
          }

          // Recuperiamo il package.json
          const packageData = await github.getPackageJson(folder);
          if (packageData) {
            projectData = {
              ...projectData,
              name: packageData.name || folder.name,
              description: packageData.description || '',
              technologies: packageData.technologies || [],
              createdAt: packageData.createdAt
                ? new Date(packageData.createdAt)
                : new Date(),
            };
          } else {
            errors.push(`Nessun package.json trovato per ${folder.name}`);
          }

          await projectService.upsert(projectData.name, projectData);

          syncedCount++;
        } catch (error: unknown) {
          const errorMessage = `Errore nel recupero dei dati per ${folder.name}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`;
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

      cache.invalidate('github:repos');

      return res.json({
        message: `Sincronizzati ${syncedCount} progetti con successo`,
        totalProjects: packageFolders.length,
        syncedProjects: syncedCount,
        errors: errors,
        projects: packageFolders.map((folder) => folder.name),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto';
      return res.status(500).json({
        message: message,
        errors: [],
      });
    }
  },
];
