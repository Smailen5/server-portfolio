import { NextFunction, Request, Response } from "express";
import { env } from "../../config/index.js";
import { createSyncService } from "../../services/SyncService.js";
import {
  authMiddleware,
  syncValidator,
  validateRequest,
  jwtAuth,
  AppError,
} from "../../middleware/index.js";

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

      const syncService = createSyncService();
      const result = await syncService.syncAll();

      if (result.syncedProjects === 0) {
        return next(
          new AppError(
            "Nessun progetto è stato sincronizzato con successo",
            500
          )
        );
      }

      return res.json({
        message: `Sincronizzati ${result.syncedProjects} progetti con successo`,
        totalProjects: result.totalProjects,
        syncedProjects: result.syncedProjects,
        errors: result.errors,
        projects: result.projects,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore sconosciuto";
      return next(new AppError(message, 500));
    }
  },
];
