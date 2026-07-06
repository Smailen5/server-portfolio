import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { appLogger } from '../../config/appLogger.js';

export const handleLoginValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    appLogger.warn(
      `Tentativo di login con dati non validi: ${errors.array().map((e) => e.msg).join('; ')}`
    );
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  next();
};
