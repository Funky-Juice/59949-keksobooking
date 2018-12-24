const request = require(`supertest`);
const {app} = require(`./src/server/server`);


describe(`POST /api/offers`, function () {

  it(`should get json`, function () {
    request(app)
        .post(`/api/offers`)
        .send({
          name: `Keks`,
          title: `Маленькая квартирка рядом с парком`,
          type: `flat`,
          price: 30000,
          address: `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`,
          timein: `12:00`,
          timeout: `13:00`,
          rooms: 1,
          guests: 1,
          features: [`dishwasher`, `conditioner`],
          description: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`
        })
        .expect(200, {
          name: `Keks`,
          title: `Маленькая квартирка рядом с парком`,
          type: `flat`,
          price: 30000,
          address: `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`,
          timein: `12:00`,
          timeout: `13:00`,
          rooms: 1,
          guests: 1,
          features: [`dishwasher`, `conditioner`],
          description: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`
        })
        .end();
  });

  it(`should get form-data`, function () {
    return request(app)
        .post(`/api/offers`)
        .field(`name`, `Keks`)
        .field(`title`, `Маленькая квартирка рядом с парком`)
        .field(`type`, `flat`)
        .field(`price`, `30000`)
        .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
        .field(`timein`, `12:00`)
        .field(`timeout`, `13:00`)
        .field(`rooms`, `1`)
        .field(`guests`, `1`)
        .field(`features`, `dishwasher`)
        .field(`features`, `conditioner`)
        .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
        .expect(200, {
          name: `Keks`,
          title: `Маленькая квартирка рядом с парком`,
          type: `flat`,
          price: 30000,
          address: `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`,
          timein: `12:00`,
          timeout: `13:00`,
          rooms: 1,
          guests: 1,
          features: [`dishwasher`, `conditioner`],
          description: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`
        });
  });

  it(`should get form-data with avatar and preview images`, function () {
    return request(app)
        .post(`/api/offers`)
        .field(`name`, `Keks`)
        .field(`title`, `Маленькая квартирка рядом с парком`)
        .field(`type`, `flat`)
        .field(`price`, `30000`)
        .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
        .field(`timein`, `12:00`)
        .field(`timeout`, `13:00`)
        .field(`rooms`, `1`)
        .field(`guests`, `1`)
        .field(`features`, `dishwasher`)
        .field(`features`, `conditioner`)
        .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
        .attach(`avatar`, `test/img/keks.png`)
        .attach(`preview`, `test/img/keks.png`)
        .expect(200, {
          name: `Keks`,
          title: `Маленькая квартирка рядом с парком`,
          type: `flat`,
          price: 30000,
          address: `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`,
          timein: `12:00`,
          timeout: `13:00`,
          rooms: 1,
          guests: 1,
          features: [`dishwasher`, `conditioner`],
          description: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`,
          avatar: [{
            fieldname: `avatar`,
            originalname: `keks.png`,
            encoding: `7bit`,
            mimetype: `image/png`,
            size: 640255
          }],
          preview: [{
            fieldname: `preview`,
            originalname: `keks.png`,
            encoding: `7bit`,
            mimetype: `image/png`,
            size: 640255
          }]
        });
  });

  it(`unknown address should return 404`, function () {
    return request(app)
        .post(`/api/offerzzz`)
        .expect(404);
  });

  describe(`"title" field`, function () {
    // infinite timeout for files upload
    this.timeout(0); // eslint-disable-line

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`preview`, `test/img/keks.png`)
          .expect(400, [{
            fieldName: `title`,
            errorMessage: `title is required`
          }]);
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, ``)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`preview`, `test/img/keks.png`)
          .expect(400, [{
            fieldName: `title`,
            fieldValue: ``,
            errorMessage: `title must be between 30 and 140 characters`
          }]);
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .attach(`avatar`, `test/img/keks.png`)
          .attach(`preview`, `test/img/keks.png`)
          .expect(400, [{
            fieldName: `title`,
            fieldValue: `Маленькая квартирка`,
            errorMessage: `title must be between 30 and 140 characters`
          }]);
    });
  });

  describe(`"type" field`, function () {
    this.timeout(0); //eslint-disable-line

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `type`,
            errorMessage: `type is required`
          }]);
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, ``)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `type`,
            fieldValue: ``,
            errorMessage: `type must be one of flat, palace, house, bungalo`
          }]);
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `qwerty`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `type`,
            fieldValue: `qwerty`,
            errorMessage: `type must be one of flat, palace, house, bungalo`
          }]);
    });
  });

  describe(`"price" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `price`,
            errorMessage: `price is required`
          }]);
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, ``)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `price`,
            fieldValue: ``,
            errorMessage: `price is not a number`
          },
          {
            fieldName: `price`,
            fieldValue: ``,
            errorMessage: `price must be between 1 and 100000 characters`
          }
          ]);
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `-30`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `price`,
            fieldValue: `-30`,
            errorMessage: `price must be between 1 and 100000`
          }]);
    });
  });

  describe(`"address" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `address`,
            errorMessage: `address is required`
          }]);
    });

    it(`should fail if address is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, ``)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `address`,
            fieldValue: ``,
            errorMessage: `address must be between 5 and 100 characters`
          }]);
    });

    it(`should fail if address is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō; 102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō; 102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `address`,
            fieldValue: `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō; 102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō; 102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`,
            errorMessage: `address must be between 5 and 100 characters`
          }]);
    });
  });

  describe(`"timein" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `timein`,
            errorMessage: `time format should be HH:mm`
          }]);
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, ``)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `timein`,
            fieldValue: ``,
            errorMessage: `time format should be HH:mm`
          }]);
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12-00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `timein`,
            fieldValue: `12-00`,
            errorMessage: `time format should be HH:mm`
          }]);
    });
  });

  describe(`"timeout" field`, function () {

    it(`should fail if timeout is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `timeout`,
            errorMessage: `time format should be HH:mm`
          }]);
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, ``)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `timeout`,
            fieldValue: ``,
            errorMessage: `time format should be HH:mm`
          }]);
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13-00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `timeout`,
            fieldValue: `13-00`,
            errorMessage: `time format should be HH:mm`
          }]);
    });
  });

  describe(`"rooms" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `rooms`,
            errorMessage: `rooms is required`
          }]);
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, ``)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [
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
          ]);
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `-1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `rooms`,
            fieldValue: `-1`,
            errorMessage: `rooms must be between 1 and 1000`
          }]);
    });
  });

  describe(`"guests" field`, function () {

    it(`should fail if field is missing`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `guests`,
            errorMessage: `guests is required`
          }]);
    });

    it(`should fail if value is empty`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, ``)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [
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
          ]);
    });

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `2000`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `guests`,
            fieldValue: `2000`,
            errorMessage: `guests must be between 1 and 10`
          }]);
    });
  });

  describe(`"features" field`, function () {

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `qwerty`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `features`,
            fieldValue: [`qwerty`],
            errorMessage: `should contain only: wifi,dishwasher,parking,washer,elevator,conditioner`
          }]);
    });
  });

  describe(`"description" field`, function () {

    it(`should fail if value is invalid`, function () {
      return request(app)
          .post(`/api/offers`)
          .field(`name`, `Keks`)
          .field(`title`, `Маленькая квартирка рядом с парком`)
          .field(`type`, `flat`)
          .field(`price`, `30000`)
          .field(`address`, `102-0075 Tōkyō-to, Chiyoda-ku, Sanbanchō`)
          .field(`timein`, `12:00`)
          .field(`timeout`, `13:00`)
          .field(`rooms`, `1`)
          .field(`guests`, `1`)
          .field(`features`, `dishwasher`)
          .field(`features`, `conditioner`)
          .field(`description`, `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС. Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`)
          .expect(400, [{
            fieldName: `description`,
            fieldValue: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС. Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`,
            errorMessage: `description must be between 5 and 100 characters`
          }]);
    });
  });
});
