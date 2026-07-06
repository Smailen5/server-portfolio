import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { appLogger } from '../../config/appLogger.js';
import { env } from '../../config/index.js';
import { AppError } from '../errorHandler.js';

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const jwtAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      appLogger.warn('Tentativo di accesso senza token');
      return next(
        new AppError('Accesso non autorizzato, token mancante', 401)
      );
    }

    const decoded = jwt.verify(
      token,
      env.jwtSecret as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    appLogger.error(`Errore di verifica token: ${error}`);
    return next(new AppError('Token non valido', 401));
  }
};
