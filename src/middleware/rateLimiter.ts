import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const limiter = rateLimit({
  windowMs: env.rateLimitWindow
    ? parseInt(env.rateLimitWindow)
    : 15 * 60 * 1000, // 15 minuti
  max: env.rateLimitMax ? parseInt(env.rateLimitMax) : 100, // Limite di 100 richieste per finestra
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limite di 5 richieste per finestra
  message: {
    success: false,
    message: 'Troppi tentativi di accesso. Riprova più tardi.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
