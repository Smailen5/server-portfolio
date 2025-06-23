
import { Collection, Db, MongoClient } from 'mongodb';
import { appLogger } from './appLogger';
import { env } from './env';

class DbConnection {
  private mongoClient: MongoClient;
  static db: Db;
  static userCollection: Collection;

  constructor() {
    this.mongoClient = new MongoClient(`${env.dbConnection}`);
  }

  async getConnection() {
    try {
      await this.mongoClient.connect();
      const db = this.mongoClient.db('server-portfolio');
      DbConnection.setInstance(db);
      appLogger.info('Connessione al database MongoDB stabilita');
    } catch (err) {
      appLogger.error('Errore nella connessione al database MongoDB: ', err);
      throw err;
    }
  }

  static setInstance(db: Db) {
    DbConnection.db = db;
    DbConnection.userCollection = db.collection('users');
  }
}

export default DbConnection;
