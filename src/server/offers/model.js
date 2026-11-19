const getDb = require(`../../database/database`);
const logger = require(`../../logger`);

const setupCollection = async () => {
  const dBase = await getDb();
  const collection = dBase.collection(`offers`);
  await collection.createIndex({name: -1}, {unique: false});
  return collection;
};

class OffersModel {
  constructor() {
    this.collection = null;
  }

  getCollection() {
    if (!this.collection) {
      this.collection = setupCollection().catch((err) => {
        this.collection = null;
        logger.error(`"Offers" collection error: ` + err);
        throw err;
      });
    }

    return this.collection;
  }

  async getAllOffers() {
    const collection = await this.getCollection();
    const cursor = collection.find();
    cursor.count = () => collection.countDocuments();
    return cursor;
  }

  async getOfferByDate(createDate) {
    return (await this.getCollection()).findOne({date: createDate});
  }

  async createOffer(offer) {
    return (await this.getCollection()).insertOne(offer);
  }
}

module.exports = new OffersModel();
