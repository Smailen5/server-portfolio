import dotenv from 'dotenv';

// Carica le variabili d'ambiente
dotenv.config();

// Configurazione dell'ambiente
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3000,
  githubToken: process.env.GITHUB_TOKEN,
};
