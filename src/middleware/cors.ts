import cors from "cors";
import { env } from "../config/env.js";

const origins = [];

if (env.isProduction) {
  // Produzione: solo CORS_ORIGIN (obbligatoria)
  if (env.corsOrigins) {
    origins.push(env.corsOrigins);
  }
} else {
  // Sviluppo: CORS_ORIGIN + CORS_DEV_ORIGIN (entrambe opzionali)
  if (env.corsOrigins) origins.push(env.corsOrigins);
  if (env.devOrigin) origins.push(env.devOrigin);
}

export const corsOptions = {
  origin: origins.length > 0 ? origins : false,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

export const corsMiddleware = cors(corsOptions);
