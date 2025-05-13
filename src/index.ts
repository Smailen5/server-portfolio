import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { initDatabase } from './config/initDb';
import githubRoutes from './routes/github';
import projectRoutes from './routes/projects';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/github', githubRoutes);

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
