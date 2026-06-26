import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { appLogger } from '../../config/appLogger.js';

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
      res
        .status(401)
        .json({ message: 'Accesso non autorizzato, token mancante' });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    appLogger.error(`Errore di verifica token: ${error}`);
    res.status(401).json({ message: 'Token non valido' });
  }
};
