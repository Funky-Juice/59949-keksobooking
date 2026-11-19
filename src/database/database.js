const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const DB_NAME = `keksobooking`;

let client = null;
let connection = null;

const getDb = () => {
  if (connection) {
    return connection;
  }

  const url = process.env.DB_HOST || `mongodb://127.0.0.1:27017`;
  client = new MongoClient(url);

  connection = client.connect()
      .then(() => client.db(DB_NAME))
      .catch((err) => {
        connection = null;
        client = null;
        logger.error(`Failed to connect to MongoDB`, err);
        throw err;
      });

  return connection;
};

module.exports = getDb;
