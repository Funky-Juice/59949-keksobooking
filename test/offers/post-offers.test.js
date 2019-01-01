const request = require(`supertest`);
const assert = require(`assert`);

const express = require(`express`);
const app = express();

const ImagesStoreMock = require(`./mock-images`);
const OffersModelMock = require(`./mock-offers`);

const offersRouter = require(`../../src/server/offers/route`);


app.use(`/api/offers`, offersRouter(OffersModelMock, ImagesStoreMock));


describe(`POST /api/offers`, function () {

  it(`should get json`, function () {
    request(app)
        .post(`/api/offers`)
        .set(`Accept`, `application/json`)
        .send({
          name: `Keks`,
          title: `Маленькая квартирка рядом с парком`,
          type: `flat`,
          price: 30000,
          address: `127, 282`,
          checkin: `12:00`,
          checkout: `13:00`,
          rooms: 1,
          guests: 1,
          features: [`dishwasher`, `conditioner`],
          description: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`
        })
        .expect(`Content-Type`, /json/)
        .expect(200);
  });

  it(`should get form-data`, function () {
    return request(app)
        .post(`/api/offers`)
        .set(`Accept`, `multipart/form-data`)
        .field(`name`, `Keks`)
        .field(`title`, `Маленькая квартирка рядом с парком`)
        .field(`type`, `flat`)
        .field(`price`, `30000`)
        .field(`address`, `127, 282`)
        .field(`checkin`, `12:00`)
        .field(`checkout`, `13:00`)
        .field(`rooms`, `1`)
        .field(`guests`, `1`)
        .field(`features`, `dishwasher`)
        .field(`features`, `conditioner`)
        .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
        .expect(`Content-Type`, /json/)
        .expect(200);
  });

  it(`should get form-data with avatar and photos`, function () {
    return request(app)
        .post(`/api/offers`)
        .set(`Accept`, `multipart/form-data`)
        .field(`name`, `Keks`)
        .field(`title`, `Маленькая квартирка рядом с парком`)
        .field(`type`, `flat`)
        .field(`price`, `30000`)
        .field(`address`, `127, 282`)
        .field(`checkin`, `12:00`)
        .field(`checkout`, `13:00`)
        .field(`rooms`, `1`)
        .field(`guests`, `1`)
        .field(`features`, `dishwasher`)
        .field(`features`, `conditioner`)
        .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
        .attach(`avatar`, `test/img/keks.png`)
        .attach(`photo`, `test/img/keks.png`)
        .expect(`Content-Type`, /json/)
        .expect(200)
        .then((res) => {
          const data = res.body;
          assert.equal(typeof data.date, `number`);
          assert.deepStrictEqual(data, {
            name: `Keks`,
            title: `Маленькая квартирка рядом с парком`,
            type: `flat`,
            price: 30000,
            address: `127, 282`,
            checkin: `12:00`,
            checkout: `13:00`,
            rooms: 1,
            guests: 1,
            features: [`dishwasher`, `conditioner`],
            description: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`,
            date: data.date,
            location: {
              x: 127,
              y: 282
            },
            avatar: `api/offers/${data.date}/avatar`,
            photo: [`api/offers/${data.date}/photo/0`]
          });
        });
  });

  it(`unknown address should return 404`, function () {
    return request(app)
        .post(`/api/offerzzz`)
        .expect(404);
  });

  describe(`"title" field`, function () {
    // infinite checkout for files upload
    this.timeout(0); // eslint-disable-line

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`photo`, `test/img/keks.png`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `title`,
              errorMessage: `title is required`
            }]
          });
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, ``)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`photo`, `test/img/keks.png`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `title`,
              fieldValue: ``,
              errorMessage: `title must be between 30 and 140 characters`
            }]
          });
    });

    it(`should fail if value is < 30 characters`, function () {
      const string = `#`.repeat(29);
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, string)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`photo`, `test/img/keks.png`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `title`,
              fieldValue: string,
              errorMessage: `title must be between 30 and 140 characters`
            }]
          });
    });

    it(`should fail if value is > 140 characters`, function () {
      const string = `#`.repeat(141);
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, string)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`photo`, `test/img/keks.png`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `title`,
              fieldValue: string,
              errorMessage: `title must be between 30 and 140 characters`
            }]
          });
    });
  });

  describe(`"type" field`, function () {
    this.timeout(0); //eslint-disable-line

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `type`,
              errorMessage: `type is required`
            }]
          });
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, ``)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `type`,
              fieldValue: ``,
              errorMessage: `type must be one of flat, palace, house, bungalo`
            }]
          });
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `qwerty`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `type`,
              fieldValue: `qwerty`,
              errorMessage: `type must be one of flat, palace, house, bungalo`
            }]
          });
    });
  });

  describe(`"price" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `price`,
              errorMessage: `price is required`
            }]
          });
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, ``)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [
              {
                fieldName: `price`,
                fieldValue: ``,
                errorMessage: `price is not a number`
              },
              {
                fieldName: `price`,
                fieldValue: ``,
                errorMessage: `price must be between 1 and 100000 characters`
              }
            ]
          });
    });

    it(`should fail if value is not a number`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `qwerty`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `price`,
              fieldValue: `qwerty`,
              errorMessage: `price is not a number`
            }]
          });
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `-30`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `price`,
              fieldValue: `-30`,
              errorMessage: `price must be between 1 and 100000`
            }]
          });
    });
  });

  describe(`"address" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `address`,
              errorMessage: `address is required`
            }]
          });
    });

    it(`should fail if address is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, ``)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `address`,
              fieldValue: ``,
              errorMessage: `address is required`
            }]
          });
    });

    it(`should fail if address format is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `Tokyo`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `address`,
              fieldValue: `Tokyo`,
              errorMessage: `address format: xxx, yyy`
            }]
          });
    });

    it(`should fail if address is not a numbers`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `xxx, yyy`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `address`,
              fieldValue: `xxx, yyy`,
              errorMessage: `values must be a numbers`
            }]
          });
    });
  });

  describe(`"checkin" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `checkin`,
              errorMessage: `time format should be HH:mm`
            }]
          });
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, ``)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `checkin`,
              fieldValue: ``,
              errorMessage: `time format should be HH:mm`
            }]
          });
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12-00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `checkin`,
              fieldValue: `12-00`,
              errorMessage: `time format should be HH:mm`
            }]
          });
    });
  });

  describe(`"checkout" field`, function () {

    it(`should fail if checkout is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `checkout`,
              errorMessage: `time format should be HH:mm`
            }]
          });
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, ``)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `checkout`,
              fieldValue: ``,
              errorMessage: `time format should be HH:mm`
            }]
          });
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13-00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `checkout`,
              fieldValue: `13-00`,
              errorMessage: `time format should be HH:mm`
            }]
          });
    });
  });

  describe(`"rooms" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `rooms`,
              errorMessage: `rooms is required`
            }]
          });
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, ``)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [
              {
                fieldName: `rooms`,
                fieldValue: ``,
                errorMessage: `rooms is not a number`
              },
              {
                fieldName: `rooms`,
                fieldValue: ``,
                errorMessage: `rooms must be between 1 and 1000 characters`
              }
            ]
          });
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `-1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `rooms`,
              fieldValue: `-1`,
              errorMessage: `rooms must be between 1 and 1000`
            }]
          });
    });
  });

  describe(`"guests" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `guests`,
              errorMessage: `guests is required`
            }]
          });
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, ``)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [
              {
                fieldName: `guests`,
                fieldValue: ``,
                errorMessage: `guests is not a number`
              },
              {
                fieldName: `guests`,
                fieldValue: ``,
                errorMessage: `guests must be between 1 and 10 characters`
              }
            ]
          });
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `2000`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `guests`,
              fieldValue: `2000`,
              errorMessage: `guests must be between 1 and 10`
            }]
          });
    });
  });

  describe(`"features" field`, function () {

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `qwerty`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `features`,
              fieldValue: [`qwerty`],
              errorMessage: `should contain only: wifi,dishwasher,parking,washer,elevator,conditioner`
            }]
          });
    });
  });

  describe(`"description" field`, function () {

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС. Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `description`,
              fieldValue: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС. Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`,
              errorMessage: `description must be between 5 and 100 characters`
            }]
          });
    });
  });

  describe(`"avatar" field`, function () {

    it(`should fail if files > 1`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`avatar`, `test/img/keks.png`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `avatar`,
              fieldValue: 2,
              errorMessage: `one file only`
            }]
          });
    });
  });

  describe(`"photo" field`, function () {

    it(`should fail if files > 3`, function () {
      return request(app)
          .post(`/api/offers`)
          .set(`Accept`, `multipart/form-data`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `127, 282`)
          .field(`checkin`, `12:00`)
          .field(`checkout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`photo`, `test/img/keks.png`)
          .attach(`photo`, `test/img/keks.png`)
          .attach(`photo`, `test/img/keks.png`)
          .attach(`photo`, `test/img/keks.png`)
          .expect(`Content-Type`, /json/)
          .expect(400, {
            errors: [{
              fieldName: `photo`,
              fieldValue: 4,
              errorMessage: `three photos maximum`
            }]
          });
    });
  });
});
