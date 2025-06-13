import { getRepos } from '../controllers/github/getRepos';
import { createAdminUser } from '../seeders/createAdminUser';
import { appLogger } from './appLogger';
import sequelize from './database';

export const initDatabase = async () => {
  try {
    // Sincronizza il database (crea le tabelle se non esistono)
    await sequelize.sync();

    // Crea l'utente admin se non esiste
    await createAdminUser();

    try {
      // await getRepos();
      appLogger.info('Dati GitHub recuperati con successo');
    } catch (error) {
      appLogger.error(`Errore nel recupero dati GitHub: ${error}`);
    }
  } catch (error: any) {
    appLogger.error('Errore durante la sincronizzazione del database:', error);
    throw new Error(
      `Errore durante la sincronizzazione del database: ${error.message}`
    );
  }
};
