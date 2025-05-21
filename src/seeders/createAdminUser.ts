import bcrypt from 'bcrypt';
import { appLogger } from '../config/appLogger';
import User from '../models/User';
import sequelize from '../config/database';

const createAdminUser = async () => {
  try {
    await sequelize.sync();
    appLogger.info('Database sincronizzato');

    const hashedPassword = await bcrypt.hash('tua_password', 10);

    await User.create({
      email: 'tua_email@example.com',
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
