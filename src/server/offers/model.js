const db = require(`../../database/database`);

const setupCollection = async () => {
  const dBase = await db();
  const collection = dBase.collection(`offers`);
  collection.createIndex({name: -1}, {unique: true});

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

module.exports = new OffersModel(setupCollection().catch((err) => console.log(`"Offers" collection error: ` + err)));
