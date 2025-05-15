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
  logLevel: process.env.LOG_LEVEL || 'info',
  logFilePath: process.env.LOG_FILE_PATH,
  errorLogFilePath: process.env.ERROR_LOG_FILE_PATH,
  corsOrigins: process.env.CORS_ORIGINS,
  devOrigin: process.env.DEV_ORIGIN,
};
