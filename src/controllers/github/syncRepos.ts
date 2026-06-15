import { Request, Response } from 'express';
import { env } from '../../config';
import { getOctokitInstance } from '../../utils/octokit';
import {
  authMiddleware,
  syncValidator,
  validateRequest,
} from '../../middleware';
import { jwtAuth } from '../../middleware/auth/jwtAuth';
import { Project } from '../../models/Projects';
import { ProjectData } from '../../types';
import {
  getPackageJson,
  getProjectsFromGithub,
  getReadme,
  getScreenshot,
} from '../../utils/githubUtils';

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

      const packageFolders = await getProjectsFromGithub(getOctokitInstance());
      let syncedCount = 0;
      let errors: string[] = [];

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
          const screenshot = await getScreenshot(getOctokitInstance(), folder.name);
          if (screenshot) {
            projectData.image = screenshot;
          } else {
            errors.push(
              `Nessuna immagine di anteprima trovata per ${folder.name}`
            );
          }

          // Recuperiamo il README.md
          const readme = await getReadme(getOctokitInstance(), folder);
          if (readme) {
            projectData.readme = readme;
          } else {
            errors.push(`Nessun README.md trovato per ${folder.name}`);
          }

          // Recuperiamo il package.json
          const packageData = await getPackageJson(getOctokitInstance(), folder);
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

          // Controlliamo se il progetto esiste già
          let project = await Project.findOne({ name: projectData.name });

          if (project) {
            // Aggiorniamo il progetto esistente con la data odierna
            await Project.updateOne(
              { name: projectData.name },
              { ...projectData, updatedAt: new Date() }
            );
          } else {
            // Creiamo un nuovo progetto
            project = await Project.create(projectData)
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
