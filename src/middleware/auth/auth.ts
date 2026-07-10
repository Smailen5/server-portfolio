import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.js";
import { AppError } from "../errorHandler.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return next(new AppError("API Key mancante", 401));
  }

  if (apiKey !== env.apiKey) {
    return next(new AppError("API Key non valida", 401));
  }

  next();
};
