import morgan from 'morgan';

// Formato per i log
const logFormat = ':method :url :status :response-time ms - :res[content-length]';

// Middleware per il logging delle richieste HTTP
export const httpLogger = morgan(logFormat, {
  // Log solo in development
  skip: (req, res) => process.env.NODE_ENV === 'production',
})
