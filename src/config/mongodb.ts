import mongoose from 'mongoose';
import { appLogger } from './appLogger';
import { env } from './env';

export const connectMongo = async () => {
  try {
    await mongoose.connect(`${env.dbConnection}`);
    appLogger.info('Connessione al database MongoDb stabilita');
  } catch (err) {
    appLogger.error('Errore nella connessione al database MongoDb: ', err);
    throw err;
  }
};
