import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { appLogger } from '../../config/appLogger';
import User from '../../models/User';

export const logUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

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
      user.getDataValue('password')
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
    await user.update({ lastLogin: new Date() });

    const token = jwt.sign(
      { id: user.getDataValue('id') },
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
