import { NextFunction, Request, Response } from "express";
import { env } from "../../config/index.js";
import { createGitHubService } from "../../services/GitHubService.js";
import { createImageService } from "../../services/ImageService.js";
import { cache } from "../../utils/cache.js";
import { getOctokitInstance } from "../../utils/octokit.js";
import {
  authMiddleware,
  syncValidator,
  validateRequest,
  jwtAuth,
  AppError,
} from "../../middleware/index.js";
import { createProjectService } from "../../services/ProjectService.js";
import { ProjectData } from "../../types/index.js";

export const syncRepos = [
  syncValidator,
  validateRequest,
  authMiddleware,
  jwtAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!env.githubToken) {
        return next(
          new AppError(
            "Token GitHub non configurato. Aggiungi GITHUB_TOKEN nel file .env",
            500
          )
        );
      }

      const github = createGitHubService(getOctokitInstance());
      const projectService = createProjectService();
      const imageService = createImageService();
      const repositories = await github.getRepositories(env.projectPrefixes);
      let syncedCount = 0;
      const errors: string[] = [];

      for (const repo of repositories) {
        try {
          let projectData: ProjectData = {
            name: repo.name,
            description: "",
            image: "",
            technologies: [] as string[],
            readme: "",
          };

          const screenshots = await github.getScreenshots(repo.name);
          const localImages: string[] = [];

          for (const screenshotUrl of screenshots) {
            const localUrl = await imageService.downloadAndConvert(
              screenshotUrl,
              repo.name
            );
            if (localUrl) {
              localImages.push(localUrl);
            }
          }

          if (localImages.length > 0) {
            projectData.image = localImages[0];
          } else {
            errors.push(
              `Nessuna immagine di anteprima trovata per ${repo.name}`
            );
          }

          const readme = await github.getReadme(repo.name);
          if (readme) {
            projectData.readme = readme;
          } else {
            errors.push(`Nessun README.md trovato per ${repo.name}`);
          }

          const packageData = await github.getPackageJson(repo.name);
          if (packageData) {
            projectData = {
              ...projectData,
              name: packageData.name || repo.name,
              description: packageData.description || "",
              technologies: packageData.technologies || [],
            };

            if (packageData.createdAt) {
              projectData.createdAt = new Date(packageData.createdAt);
            }
          } else {
            errors.push(`Nessun package.json trovato per ${repo.name}`);
          }

          await projectService.upsert(projectData.name, projectData);

          syncedCount++;
        } catch (error: unknown) {
          const errorMessage = `Errore nel recupero dei dati per ${repo.name}: ${error instanceof Error ? error.message : "Errore sconosciuto"}`;
          errors.push(errorMessage);
        }
      }

      if (syncedCount === 0) {
        return next(
          new AppError(
            "Nessun progetto è stato sincronizzato con successo",
            500
          )
        );
      }

      cache.invalidate("github:repos");

      return res.json({
        message: `Sincronizzati ${syncedCount} progetti con successo`,
        totalProjects: repositories.length,
        syncedProjects: syncedCount,
        errors: errors,
        projects: repositories.map((repo) => repo.name),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore sconosciuto";
      return next(new AppError(message, 500));
    }
  },
];
