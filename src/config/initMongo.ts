import { appLogger } from "./appLogger.js";
import { connectMongo } from "./mongodb.js";
import { createAdminUser } from "../seeders/createAdminUser.js";

const initMongo = async () => {
  try {
    await connectMongo();
    await createAdminUser();
    appLogger.info("MongoDB inizializzato con successo");
  } catch (err) {
    appLogger.error("Errore nell'inizializzazione di MongoDB: ", err);
    throw err;
  }
};

export default initMongo;
