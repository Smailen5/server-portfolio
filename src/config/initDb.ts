import sequelize from './database';

export const initDatabase = async () => {
  try {
    // Sincronizza il database (crea le tabelle se non esistono)
    await sequelize.sync();
    // console.log('Database sincronizzato con successo');
  } catch (error: any) {
    // console.error('Errore durante la sincronizzazione del database:', error);
    throw new Error(
      `Errore durante la sincronizzazione del database: ${error.message}`
    );
  }
};
