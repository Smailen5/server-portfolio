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

// Definisce il formato dei log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Definisce dove salvare i log
const transports = [
  // Console per tutti i log
  new winston.transports.Console(),
  // File per gli errori
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // File per tutti i log
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Crea il logger
export const appLogger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
