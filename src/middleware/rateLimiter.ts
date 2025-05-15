import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const limiter = rateLimit({
  windowMs: env.rateLimitWindow
    ? parseInt(env.rateLimitWindow)
    : 15 * 60 * 1000, // 15 minuti
  max: env.rateLimitMax ? parseInt(env.rateLimitMax) : 100, // Limite di 100 richieste per finestra
});
