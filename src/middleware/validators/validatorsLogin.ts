import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../errorHandler.js";
import { appLogger } from "../../config/appLogger.js";

export const handleLoginValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    appLogger.warn(
      `Tentativo di login con dati non validi: ${errors
        .array()
        .map((e) => e.msg)
        .join("; ")}`
    );
    const errorMessages = errors.array().map((err) => err.msg);
    return next(new AppError(errorMessages.join(", "), 400));
  }
  next();
};
