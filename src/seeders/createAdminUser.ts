import bcrypt from 'bcrypt';
import { appLogger } from '../config/appLogger';
import sequelize from '../config/database';
import { env } from '../config/env';
import User from '../models/User';

const createAdminUser = async () => {
  try {
    await sequelize.sync();
    appLogger.info('Database sincronizzato');

    if (!env.adminEmail || !env.adminPassword) {
      throw new Error('Credenziali admin non configurate nel file .env');
    }

    const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

    await User.create({
      email: env.adminEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    appLogger.info('Utente amministratore creato con successo');
  } catch (error) {
    appLogger.error(`Errore nella creazione dell'utente admin: ${error}`);
  } finally {
    await sequelize.close();
  }
};

createAdminUser();
