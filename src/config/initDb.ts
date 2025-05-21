import { createAdminUser } from '../seeders/createAdminUser';
import sequelize from './database';

export const initDatabase = async () => {
  try {
    // Sincronizza il database (crea le tabelle se non esistono)
    await sequelize.sync();

    // Crea l'utente admin se non esiste
    await createAdminUser();
  } catch (error: any) {
    // console.error('Errore durante la sincronizzazione del database:', error);
    throw new Error(
      `Errore durante la sincronizzazione del database: ${error.message}`
    );
  }
};
