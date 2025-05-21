import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

dotenv.config();

export const logUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: 'Utente non trovato' });

    const isPasswordValid = await bcrypt.compare(
      password,
      user.getDataValue('password')
    );
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Password non valida' });

    const token = jwt.sign(
      { id: user.getDataValue('id') },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '24h',
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Credenziali non valide' });
  }
};
