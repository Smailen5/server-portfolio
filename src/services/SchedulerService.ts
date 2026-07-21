import cron from "node-cron";
import { appLogger } from "../config/appLogger.js";
import { env } from "../config/index.js";
import { createSyncService } from "./SyncService.js";

export function createSchedulerService() {
  let task: cron.ScheduledTask | null = null;

  return {
    start: () => {
      if (task) return;

      appLogger.info(`Scheduler avviato con cron: ${env.syncCron}`);

      task = cron.schedule(env.syncCron, async () => {
        appLogger.info("Sync automatica iniziata");
        try {
          const syncService = createSyncService();
          const result = await syncService.syncAll();
          appLogger.info(
            `Sync automatica completata: ${result.syncedProjects}/${result.totalProjects} progetti`
          );
          if (result.errors.length > 0) {
            appLogger.warn(`Errori sync: ${result.errors.join(", ")}`);
          }
        } catch (error) {
          appLogger.error("Sync automatica fallita:", error);
        }
      });
    },

    stop: () => {
      if (task) {
        task.stop();
        task = null;
        appLogger.info("Scheduler fermato");
      }
    },
  };
}

export type SchedulerService = ReturnType<typeof createSchedulerService>;
