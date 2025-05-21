import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { appLogger } from '../../config/appLogger';

dotenv.config();

export const logUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      appLogger.warn(`Tentativo di login fallito: email non trovata - ${email}`);
      res.status(401).json({ message: 'Utente non trovato' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.getDataValue('password')
    );
    if (!isPasswordValid) {
      appLogger.warn(`Tentativo di login fallito: password non valida - ${email}`);
      res.status(401).json({ message: 'Password non valida' });
      return;
    }

    // Aggiorna lastLogin
    await user.update({ lastLogin: new Date() });

    const token = jwt.sign(
      { id: user.getDataValue('id') },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '24h',
      }
    );
    appLogger.info(`Login effettuato con successo: ${email}`);
    res.json({ token });
  } catch (error) {
    appLogger.error(`Errore durante il login: ${error}`)
    res.status(401).json({ message: 'Credenziali non valide' });
  }
};
