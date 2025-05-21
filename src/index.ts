import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { initDatabase } from './config/initDb';
import { serverConfig } from './config/server';
import { validateEnv } from './config/validateEnv';
import { corsMiddleware } from './middleware/cors';
import {
  AppError,
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';
import { httpLogger } from './middleware/httpLogger';
import { limiter } from './middleware/rateLimiter';
import githubRoutes from './routes/github';
import projectRoutes from './routes/projects';
import usersRoutes from './routes/users/routes';

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(httpLogger);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/users', usersRoutes);

// Rate Limiting
app.use(limiter);

// Protezione dai problemi di sicurezza
app.use(helmet());

// Gestisce le rotte non trovate
app.all('*', notFoundHandler);

// Gestisce tutti gli errori
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Inizializza il database e avvia il server
const startServer = async () => {
  try {
    validateEnv();
    await initDatabase();
    app.listen(serverConfig.port, () => {
      // console.log(`Server in esecuzione sulla porta ${serverConfig.port}`);
    });
  } catch (error: any) {
    // console.error("Errore durante l'avvio del server:", error);
    if (error instanceof AppError) {
      console.error(`Errore di configurazione: ${error.message}`);
    } else {
      console.error("Errore durante l'avvio del server:", error);
    }
    process.exit(1);
  }
};

// Gestione degli errori non catturati
process.on('uncaughtException', (error: Error) => {
  // console.error('Errore non gestito:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  // console.error('Promise rejection non gestita:', reason);
  process.exit(1);
});

startServer();
