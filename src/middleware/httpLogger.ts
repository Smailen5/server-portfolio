import morgan from 'morgan';

// Formato per i log
const logFormat =
  'Method: :method Url: :url Status: :status Response Time: :response-time ms - Size: :res[content-length]';

// Middleware per il logging delle richieste HTTP
export const httpLogger = morgan(logFormat, {
  // Log solo in development
  skip: (_req, _res) => process.env.NODE_ENV === 'production',
});
