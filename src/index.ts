import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { initDatabase } from './config/initDb';
import projectRoutes from './routes/routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/projects', projectRoutes);

// Inizializza il database e avvia il server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Server in esecuzione sulla porta ${port}`);
    });
  } catch (error) {
    console.error("Errore durante l'avvio del server:", error);
    process.exit(1);
  }
};

startServer();
