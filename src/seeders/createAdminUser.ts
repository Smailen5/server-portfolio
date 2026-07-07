import bcrypt from 'bcrypt';
import { appLogger } from '../config/appLogger.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export const createAdminUser = async () => {
  try {
    if (!env.adminEmail || !env.adminPassword) {
      throw new Error('Credenziali admin non configurate nel file .env');
    }

    const adminExists = await User.findOne({ email: env.adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

      await User.create({
        name: 'Admin',
        email: env.adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });

      appLogger.info('Utente amministratore creato con successo');
    } else {
      appLogger.info('Utente amministratore già esistente');
    }
  } catch (error) {
    appLogger.error("Errore nella creazione dell'utente admin:",  error);
    throw error;
  }
};
