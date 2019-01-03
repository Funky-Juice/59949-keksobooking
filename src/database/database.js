const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const url = process.env.DB_HOST || `mongodb://127.0.0.1:27017`;

const connectDB = MongoClient.connect(url)
    .then((client) => {
      return client.db(`booking`);
    })
    .catch((err) => {
      logger.error(`Failed to connect to MongoDB`, err);
      process.exit(1);
    });

module.exports = connectDB;
