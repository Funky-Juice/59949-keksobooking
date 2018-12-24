const request = require(`supertest`);
const assert = require(`assert`);
// const {app} = require(`./src/server/server`);
const express = require(`express`);
const app = express();

const ImagesStoreMock = require(`./mock-images`);
const OffersModelMock = require(`./mock-offers`);

const offersRouter = require(`../../src/server/offers/route`);


app.use(`/api/offers`, offersRouter(OffersModelMock, ImagesStoreMock));


describe(`GET /api/offers`, function () {

  it(`response with json`, () => {
    return request(app)
        .get(`/api/offers`)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const dataObj = response.body;
          assert.equal(dataObj.total, 7);
          assert.equal(dataObj.data.length, 7);
          assert.equal(Array.isArray(dataObj.data), true);
          assert.equal(Object.keys(dataObj.data[0]).length, 4);
        });
  });

  it(`unknown address should return 404`, () => {
    return request(app)
        .get(`/api/offerzzz`)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /html/)
        .expect(404);
  });

});


describe(`GET /api/offers/:date`, function () {

  it(`should return offer with actual date`, () => {
    return request(app)
        .get(`/api/offers/1519945280`)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((response) => {
          const dataObj = response.body;
          assert.equal(dataObj.date, `1519945280`);
          assert.equal(Object.keys(dataObj).length, 4);
        });
  });

  it(`date mismatch returns 404`, () => {
    return request(app)
        .get(`/api/offers/1500000000`)
        .set(`Accept`, `application/json`)
        .expect(`Content-Type`, /html/)
        .expect(404);
  });

});
