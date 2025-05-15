import winston from 'winston';

// Definisce i livelli di log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Scegliamo il livello di log in base all'ambiente
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Definisce i colori per i livelli di log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Aggiunge i colori ai livelli di log
winston.addColors(colors);

// Formato per i file di log (senza colori)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Format per la console (con colori)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Definisce dove salvare i log
const transports = [
  // Console con colori
  new winston.transports.Console({
    format: consoleFormat,
  }),
  // File per gli errori (senza colori)
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: fileFormat,
  }),
  // File per tutti i log
  new winston.transports.File({ filename: 'logs/all.log', format: fileFormat }),
];

// Crea il logger
export const appLogger = winston.createLogger({
  level: level(),
  levels,
  transports,
});
