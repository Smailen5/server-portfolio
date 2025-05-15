import cors from 'cors';
import { env } from '../config/env';

export const corsOptions = {
  origin:
    env.corsOrigins && env.devOrigin ? [env.corsOrigins, env.devOrigin] : false,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
