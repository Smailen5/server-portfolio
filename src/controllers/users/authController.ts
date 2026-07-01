import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { appLogger } from '../../config/appLogger.js';
import {User} from '../../models/User.js';

export const logUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      appLogger.warn(
        `Tentativo di login fallito: utente non trovato - ${email}`
      );
      res.status(401).json({
        success: false,
        message: 'Credenziali non valide',
      });
      return;
    }

    // Verifica la password con bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      appLogger.warn(
        `Tentativo di login fallito: password non valida - ${email}`
      );
      res.status(401).json({
        success: false,
        message: 'Credenziali non valide',
      });
      return;
    }

    // Aggiorna lastLogin
    await user.updateOne({ _id: user._id }, { lastLogin: new Date() });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    appLogger.info(`Login effettuato con successo: ${email}`);
    res.json({ token });
  } catch (error) {
    appLogger.error(`Errore durante il login: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Errore durante il login',
    });
  }
};
