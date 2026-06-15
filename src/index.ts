import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { appLogger } from './config/appLogger';
// import DbConnection from './config/mongodb';
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
import usersRoutes from './routes/users';
import initMongo from './config/initMongo';

const app = express();
// const conn = new DbConnection();

// Protezione dai problemi di sicurezza
app.use(helmet());

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(httpLogger);

// Rate Limiting
app.use(limiter);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/users', usersRoutes);

// Gestisce le rotte non trovate
app.all('/{*splat}', notFoundHandler);

// Gestisce tutti gli errori
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Inizializza il database e avvia il server
const startServer = async () => {
  try {
    validateEnv();
    // await initDatabase();
    await initMongo()
    // await conn.getConnection();
    app.listen(Number(serverConfig.port), '0.0.0.0', () => {
      appLogger.info(`Server in esecuzione sulla porta ${serverConfig.port}`);
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
