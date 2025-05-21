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
  apiKey: process.env.API_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
  logFilePath: process.env.LOG_FILE_PATH,
  errorLogFilePath: process.env.ERROR_LOG_FILE_PATH,
  corsOrigins: process.env.CORS_ORIGIN,
  devOrigin: process.env.DEV_ORIGIN,
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: process.env.RATE_LIMIT_MAX,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
};
