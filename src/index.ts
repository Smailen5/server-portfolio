import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { appLogger } from "./config/appLogger.js";
import { env } from "./config/index.js";
import { validateEnv } from "./config/validateEnv.js";
import { corsMiddleware } from "./middleware/cors.js";
import {
  AppError,
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";
import { createSyncService } from "./services/SyncService.js";
import { httpLogger } from "./middleware/httpLogger.js";
import { limiter } from "./middleware/rateLimiter.js";
import healthCheckRoutes from "./routes/healthcheck/index.js";
import githubRoutes from "./routes/github/index.js";
import projectRoutes from "./routes/projects/index.js";
import usersRoutes from "./routes/users/index.js";
import initMongo from "./config/initMongo.js";
import { createSchedulerService } from "./services/SchedulerService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("trust proxy", 2);

// Protezione dai problemi di sicurezza
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(httpLogger);

// Rate Limiting
app.use(limiter);

// Routes
app.use("/", healthCheckRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/users", usersRoutes);

// Serve screenshot statici
app.use(
  "/screenshots",
  express.static(path.join(__dirname, "../public/screenshots"))
);

// Gestisce le rotte non trovate
app.all("/{*splat}", notFoundHandler);

// Gestisce tutti gli errori
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Inizializza il database e avvia il server
const startServer = async () => {
  try {
    validateEnv();
    await initMongo();
    const scheduler = createSchedulerService();
    scheduler.start();
    const server = app.listen(Number(env.port), "0.0.0.0", () => {
      appLogger.info(`Server in esecuzione sulla porta ${env.port}`);
    });

    (async () => {
      try {
        appLogger.info("Sync iniziale all'avvio del server");
        const syncService = createSyncService();
        const result = await syncService.syncAll();
        appLogger.info(
          `Sync iniziale completata: ${result.syncedProjects}/${result.totalProjects} progetti`
        );
        if (result.errors.length > 0) {
          appLogger.warn(`Errori sync iniziale: ${result.errors.join(", ")}`);
        }
      } catch (error) {
        appLogger.error("Sync iniziale fallita:", error);
      }
    })();

    const gracefulShutdown = async (signal: string) => {
      appLogger.info(`Ricevuto ${signal}, chiusura server in corso...`);
      scheduler.stop();
      server.close(async () => {
        await mongoose.connection.close();
        appLogger.info("Connessione MongoDB chiusa");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error: unknown) {
    if (error instanceof AppError) {
      appLogger.error(`Errore di configurazione: ${error.message}`);
    } else {
      appLogger.error("Errore durante l'avvio del server:", error);
    }
    process.exit(1);
  }
};

// Gestione degli errori non catturati
process.on("uncaughtException", (error: Error) => {
  appLogger.error("Errore non gestito:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  appLogger.error("Promise rejection non gestita:", reason);
  process.exit(1);
});

startServer();
