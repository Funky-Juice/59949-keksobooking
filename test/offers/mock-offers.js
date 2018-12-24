const {generateEntity} = require(`./generator`);

const mockData = generateEntity(1);


class OffersModelMock {
  constructor() {}

  async getAllOffers() {
    return mockData;
  }

  async getOfferByDate(createDate) {
    return mockData.find((it) => {
      it.date = createDate;
    });
  }

  async createOffer(offer) {
    return offer;
  }
}

module.exports = new OffersModelMock();
