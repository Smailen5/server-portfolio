import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../errorHandler';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    throw new AppError('API Key mancante', 401);
  }

  if (apiKey !== env.apiKey) {
    throw new AppError('API Key non valida', 401);
  }

  next();
};
