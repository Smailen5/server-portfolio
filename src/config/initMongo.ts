import { appLogger } from './appLogger';
import { connectMongo } from './mongodb';
import { createAdminUser } from '../seeders/createAdminUser';

const initMongo = async ()=>{
  try {
    await connectMongo()
    await createAdminUser()
    appLogger.info('MongoDB inizializzato con successo')
  } catch (err) {
    appLogger.error("Errore nell'inizializzazione di MongoDB: ", err)
    throw err
  }
}

export default initMongo
