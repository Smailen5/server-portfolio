import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { initDatabase } from './config/initDb';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { limiter } from './middleware/rateLimiter';
import githubRoutes from './routes/github';
import projectRoutes from './routes/projects';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(bodyParser.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/github', githubRoutes);

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
    await initDatabase();
    app.listen(port, () => {
      // console.log(`Server in esecuzione sulla porta ${port}`);
    });
  } catch (error: any) {
    // console.error("Errore durante l'avvio del server:", error);
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
