const assert = require(`assert`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const access = promisify(fs.access);
const unlink = promisify(fs.unlink);
const {URL} = require(`url`);

const generate = require(`../src/cli/generate.js`);
const Data = require(`../src/data/data.js`);
const {generateEntity} = require(`./offers/generator`);

describe(`Generate JSON file`, () => {
  it(`should create json file`, () => {
    const filePath = `test/testFile.json`;
    return generate.execute(1, filePath, `wr`)
        .then(() => access(filePath))
        .then(() => unlink(filePath));
  });
});

describe(`JSON author object check`, () => {
  let data;
  before(() => {
    data = generateEntity()[0];
  });

  it(`should exist`, () => {
    assert.notEqual(typeof data.author, `undefined`);
  });

  describe(`author.avatar field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.author.avatar, `undefined`);
    });

    it(`should have a string value`, () => {
      assert.equal(typeof data.author.avatar, `string`);
    });

    it(`should have an http or https protocol`, () => {
      const myURL = new URL(data.author.avatar);
      const val = (myURL.protocol === `http:` || myURL.protocol === `https:`);
      assert.equal(val, true);
    });

    it(`should have a valid domain`, () => {
      const myURL = new URL(data.author.avatar);
      assert.equal(myURL.hostname, `robohash.org`);
    });

    it(`shouldn't have a blank path`, () => {
      const myURL = new URL(data.author.avatar);
      assert.notEqual(myURL.pathname, `/`);
    });
  });
});

describe(`JSON offer object check`, () => {
  let data;
  before(() => {
    data = generateEntity()[0];
  });

  it(`should exist`, () => {
    assert.notEqual(typeof data.offer, `undefined`);
  });

  describe(`offer.title field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.title, `undefined`);
    });

    it(`should have a string value`, () => {
      assert.equal(typeof data.offer.title, `string`);
    });

    it(`should have one of the values: ${Data.TITLE}`, () => {
      let val = false;

      function comparison(elem) {
        if (data.offer.title === elem) {
          val = true;
        }
      }
      Data.TITLE.forEach(comparison);
      assert.equal(val, true);
    });
  });

  describe(`offer.address field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.address, `undefined`);
    });

    it(`should have a string value`, () => {
      assert.equal(typeof data.offer.address, `string`);
    });

    it(`should have two values`, () => {
      let coordinates = data.offer.address.split(`, `);
      assert.equal(coordinates.length, 2);
    });

    it(`should have values data.location.x, data.location.y`, () => {
      function comparison(arr) {
        return (+arr[0] === data.location.x && +arr[1] === data.location.y);
      }
      let coordinates = data.offer.address.split(`, `);
      assert.equal(comparison(coordinates), true);
    });
  });

  describe(`offer.price field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.price, `undefined`);
    });

    it(`should have a num value`, () => {
      assert.equal(typeof data.offer.price, `number`);
    });

    it(`should have a value >= 1000 and <= 1 000 000`, () => {
      let val = (data.offer.price >= 1000 && data.offer.price <= 1000000);
      assert.equal(val, true);
    });
  });

  describe(`offer.type field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.type, `undefined`);
    });

    it(`should have a string value`, () => {
      assert.equal(typeof data.offer.type, `string`);
    });

    it(`should have one of the values: ${Data.TYPE}`, () => {
      let val = false;

      function comparison(elem) {
        if (data.offer.type === elem) {
          val = true;
        }
      }
      Data.TYPE.forEach(comparison);
      assert.equal(val, true);
    });
  });

  describe(`offer.rooms field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.rooms, `undefined`);
    });

    it(`should have a number value`, () => {
      assert.equal(typeof data.offer.rooms, `number`);
    });

    it(`should have a value >= 1 and <= 5`, () => {
      let val = (data.offer.rooms >= 1 && data.offer.rooms <= 5);
      assert.equal(val, true);
    });
  });

  describe(`offer.guests field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.guests, `undefined`);
    });

    it(`should have a number value`, () => {
      assert.equal(typeof data.offer.guests, `number`);
    });

    it(`should have a value >= 1 and <= 15`, () => {
      let val = (data.offer.guests >= 1 && data.offer.guests <= 15);
      assert.equal(val, true);
    });
  });

  describe(`offer.checkin field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.checkin, `undefined`);
    });

    it(`should have a string value`, () => {
      assert.equal(typeof data.offer.checkin, `string`);
    });

    it(`should have one of the values: ${Data.TIME}`, () => {
      let val = false;

      function comparison(elem) {
        if (data.offer.checkin === elem) {
          val = true;
        }
      }
      Data.TIME.forEach(comparison);
      assert.equal(val, true);
    });
  });

  describe(`offer.checkout field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.checkout, `undefined`);
    });

    it(`should have a string value`, () => {
      assert.equal(typeof data.offer.checkout, `string`);
    });

    it(`should have one of the values: ${Data.TIME}`, () => {
      let val = false;

      function comparison(elem) {
        if (data.offer.checkout === elem) {
          val = true;
        }
      }
      Data.TIME.forEach(comparison);
      assert.equal(val, true);
    });
  });

  describe(`offer.features field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.features, `undefined`);
    });

    it(`must be an array`, () => {
      assert.equal(Array.isArray(data.offer.features), true);
    });

    it(`offer.features length should be >= 1 and <= ${Data.FEATURES.length}`, () => {
      let val = (data.offer.features.length >= 1 && data.offer.features.length <= Data.FEATURES.length);
      assert.equal(val, true);
    });

    it(`must contain only this values: ${Data.FEATURES}`, () => {
      function comparison(elem) {
        return Data.FEATURES.includes(elem);
      }
      assert.equal(data.offer.features.every(comparison), true);
    });

    it(`should have no duplicates`, () => {
      function hasDuplicates(array) {
        let valuesSoFar = Object.create(null);
        for (let i = 0; i < array.length; ++i) {
          let value = array[i];
          if (value in valuesSoFar) {
            return true;
          }
          valuesSoFar[value] = true;
        }
        return false;
      }
      assert.notEqual(hasDuplicates(data.offer.features), true);
    });
  });

  describe(`offer.description field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.description, `undefined`);
    });

    it(`should have a string value`, () => {
      assert.equal(typeof data.offer.description, `string`);
    });

    it(`string value must be empty`, () => {
      assert.equal(data.offer.description.length, 0);
    });
  });

  describe(`offer.photos field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.offer.photos, `undefined`);
    });

    it(`must be an array`, () => {
      assert.equal(Array.isArray(data.offer.photos), true);
    });

    it(`should not be empty`, () => {
      assert.notEqual(data.offer.photos.length, 0);
    });

    it(`must contain only photos`, () => {
      function comparison(elem) {
        return Data.PHOTOS.includes(elem);
      }
      assert.equal(data.offer.photos.every(comparison), true);
    });
  });
});

describe(`JSON location object check`, () => {
  let data;
  before(() => {
    data = generateEntity()[0];
  });

  it(`should exist`, () => {
    assert.notEqual(typeof data.location, `undefined`);
  });

  describe(`location.x field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.location.x, `undefined`);
    });

    it(`should have a num value`, () => {
      assert.equal(typeof data.location.x, `number`);
    });

    it(`should have a value >= 300 and <= 900`, () => {
      let val = (data.location.x >= 300 && data.location.x <= 900);
      assert.equal(val, true);
    });
  });

  describe(`location.y field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.location.y, `undefined`);
    });

    it(`should have a num value`, () => {
      assert.equal(typeof data.location.y, `number`);
    });

    it(`should have a value >= 150 and <= 500`, () => {
      let val = (data.location.y >= 150 && data.location.y <= 500);
      assert.equal(val, true);
    });
  });
});

describe(`JSON date field check`, () => {
  let data;
  before(() => {
    data = generateEntity()[0];
  });

  describe(`date field check`, () => {
    it(`should exist`, () => {
      assert.notEqual(typeof data.date, `undefined`);
    });

    it(`should have a num value`, () => {
      assert.equal(typeof data.date, `number`);
    });

    it(`should have a value >= ${(Math.floor(Date.now() / 1000)) - (60 * 60 * 24 * 7)} and <= ${Math.floor(Date.now() / 1000)}`, () => {
      const dateNow = Math.floor(Date.now() / 1000);
      const week = 60 * 60 * 24 * 7;

      let val = (data.date >= (dateNow - week) && data.date <= dateNow);
      assert.equal(val, true);
    });
  });
});
