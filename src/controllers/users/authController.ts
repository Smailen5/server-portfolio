import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appLogger } from "../../config/appLogger.js";
import { env } from "../../config/index.js";
import { User } from "../../models/User.js";
import { AppError } from "../../middleware/errorHandler.js";

export const logUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      appLogger.warn(
        `Tentativo di login fallito: utente non trovato - ${email}`
      );
      return next(new AppError("Credenziali non valide", 401));
    }

    // Verifica la password con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      appLogger.warn(
        `Tentativo di login fallito: password non valida - ${email}`
      );
      return next(new AppError("Credenziali non valide", 401));
    }

    // Aggiorna lastLogin
    await user.updateOne({ lastLogin: new Date() });

    const token = jwt.sign({ id: user._id }, env.jwtSecret as string, {
      expiresIn: "24h",
    });

    appLogger.info(`Login effettuato con successo: ${email}`);
    res.json({ token });
  } catch (error) {
    appLogger.error(`Errore durante il login: ${error}`);
    return next(new AppError("Errore durante il login", 500));
  }
};
