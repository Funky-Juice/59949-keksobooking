const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;

const connectDB = async () => {
  const client = await MongoClient.connect(url);
  const db = client.db(`booking`);

  return db;
};

connectDB().catch((err) => {
  throw err;
});


module.exports = connectDB;