const db = require(`../../database/database`);
const logger = require(`../../logger`);

const setupCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(`offers`);
  collection.createIndex({name: -1}, {unique: false});

  return collection;
};

class OffersModel {
  constructor(collection) {
    this.collection = collection;
  }

  async getAllOffers() {
    return (await this.collection).find();
  }

  async getOfferByDate(createDate) {
    return (await this.collection).findOne({date: createDate});
  }

  async createOffer(offer) {
    return (await this.collection).insertOne(offer);
  }
}

module.exports = new OffersModel(setupCollection().catch((err) => {
  logger.error(`"Offers" collection error: ` + err);
  process.exit(1);
}));
