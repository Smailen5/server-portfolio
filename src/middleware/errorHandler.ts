import { NextFunction, Request, Response } from 'express';
import { appLogger } from '../config/appLogger.js';
import { env } from '../config/env.js';

// Classe personalizzata per gestire gli errori
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware per gestire gli errori
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // se è un errore personalizzato
  if (err instanceof AppError) {
    appLogger.error(`${err.statusCode} - ${err.message}`);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  // per errori non operativi (errori di programmazione)
  console.error('ERROR 💥', err);

  appLogger.error(`500 - ${err.message}`);
  return res.status(500).json({
    status: 'error',
    message: env.isDevelopment ? err.message : 'Qualcosa è andato storto!',
    ...(env.isDevelopment && { stack: err.stack }),
  });
};

// Middleware per gestire le rotte non trovate
export const notFoundHandler = (req: Request, res: Response) => {
  appLogger.warn(`404 - Rotta non trovata: ${req.originalUrl}`);
  res.status(404).json({
    status: 'fail',
    message: `Non è possibile trovare ${req.originalUrl} su questo server`,
  });
};
