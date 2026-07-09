import cors from 'cors';
import { env } from '../config/env.js';

export const corsOptions = {
  origin:
    env.corsOrigins && env.devOrigin ? [env.corsOrigins, env.devOrigin] : false,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
};

export const corsMiddleware = cors(corsOptions);
