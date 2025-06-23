import bcrypt from 'bcrypt';
import { appLogger } from '../config/appLogger';
import { env } from '../config/env';
import {User} from '../models/User';

export const createAdminUser = async () => {
  try {
    if (!env.adminEmail || !env.adminPassword) {
      throw new Error('Credenziali admin non configurate nel file .env');
    }

    const adminExists = await User.findOne({
      where: { email: env.adminEmail },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

      await User.create({
        email: env.adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });

      appLogger.info('Utente amministratore creato con successo');
    }
  } catch (error) {
    appLogger.error(`Errore nella creazione dell'utente admin: ${error}`);
    throw error;
  }
};
