import { env } from "../config/index.js";
import { createGitHubService } from "./GitHubService.js";
import { createImageService } from "./ImageService.js";
import { createProjectService } from "./ProjectService.js";
import { cache } from "../utils/cache.js";
import { getOctokitInstance } from "../utils/octokit.js";
import { ProjectData, SyncResult } from "../types/index.js";

export function createSyncService() {
  return {
    syncAll: async (): Promise<SyncResult> => {
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
            repoName: repo.name,
            repoUrl: repo.html_url,
            description: "",
            images: [],
            technologies: [] as string[],
            readme: "",
            version: "",
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
            projectData.images = localImages;
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
              version: packageData.version || "",
            };

            if (packageData.createdAt) {
              projectData.createdAt = new Date(packageData.createdAt);
            }
          } else {
            errors.push(`Nessun package.json trovato per ${repo.name}`);
          }

          await projectService.upsert(projectData.repoName, projectData);

          syncedCount++;
        } catch (error: unknown) {
          const errorMessage = `Errore nel recupero dei dati per ${repo.name}: ${error instanceof Error ? error.message : "Errore sconosciuto"}`;
          errors.push(errorMessage);
        }
      }

      cache.invalidate("github:repos");

      return {
        totalProjects: repositories.length,
        syncedProjects: syncedCount,
        errors: errors,
        projects: repositories.map((repo) => repo.name),
      };
    },
  };
}

export type SyncService = ReturnType<typeof createSyncService>;
