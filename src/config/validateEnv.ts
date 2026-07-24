import { AppError } from "../middleware/index.js";
import { env } from "./env.js";

export const validateEnv = () => {
  const requireVars = [
    "apiKey",
    "jwtSecret",
    "dbConnection",
    "adminEmail",
    "adminPassword",
  ] as const;

  for (const key of requireVars) {
    if (env[key] === undefined) {
      throw new AppError(`La variabile ${key} non è stata impostata`, 500);
    }
  }
};
