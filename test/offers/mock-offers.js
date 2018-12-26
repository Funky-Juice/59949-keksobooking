const {generateEntity} = require(`./generator`);

const offers = generateEntity();

class Cursor {
  constructor(data) {
    this.data = data;
  }

  skip(count) {
    return new Cursor(this.data.slice(count));
  }

  limit(count) {
    return new Cursor(this.data.slice(0, count));
  }

  async count() {
    return this.data.length;
  }

  async toArray() {
    return this.data;
  }
}

class OffersModelMock {
  constructor() {}

  async getAllOffers() {
    return new Cursor(offers);
  }

  async getOfferByDate(createDate) {
    return offers.find((it) => {
      it.date = createDate;
    });
  }

  async createOffer(offer) {
    return offer;
  }
}

module.exports = new OffersModelMock();
