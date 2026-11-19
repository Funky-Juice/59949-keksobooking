const {generateEntity} = require(`./generator`);

const offers = generateEntity();

class Cursor {
  constructor(data, total = data.length) {
    this.data = data;
    this.total = total;
  }

  skip(count) {
    return new Cursor(this.data.slice(count), this.total);
  }

  limit(count) {
    return new Cursor(this.data.slice(0, count), this.total);
  }

  async count() {
    return this.total;
  }

  async toArray() {
    return this.data;
  }
}

class OffersModelMock {
  constructor() {
    this.data = offers;
  }

  async getAllOffers() {
    return new Cursor(this.data);
  }

  async getOfferByDate(createDate) {
    return this.data.find((it) => {
      return it.date === createDate;
    });
  }

  async createOffer(offer) {
    return offer;
  }
}

module.exports = new OffersModelMock();
