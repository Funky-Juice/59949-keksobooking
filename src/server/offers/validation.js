require(`async-validate/plugin/all`);

const Data = require(`../../data/data`);
const Schema = require(`async-validate`);
const ValidationError = require(`../error/validation-error`);
const {stringToInt} = require(`../../util/util`);

Schema.plugin([require(`../../util/assertion`)]);


const descriptor = {
  type: `object`,
  fields: {
    name: {type: `string`, required: true, min: 3, max: 20},
    title: {type: `string`, required: true, min: 30, max: 140},
    type: {type: `enum`, required: true, list: Data.TYPE},
    address(cb) {
      if (this.value) {
        const coordinates = this.value.split(`,`);
        if (coordinates.length !== 2) {
          this.raise(`${this.field} format: xxx, yyy`);
        } else if (typeof stringToInt(coordinates[0]) !== `number` || typeof stringToInt(coordinates[1]) !== `number`) {
          this.raise(`values must be a numbers`);
        }
      } else {
        this.raise(`${this.field} is required`);
      }
      cb();
    },
    description: {type: `string`, required: false, min: 5, max: 100},
    checkin: {
      type: `string`,
      required: true,
      pattern: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      message: `time format should be HH:mm`
    },
    checkout: {
      type: `string`,
      required: true,
      pattern: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      message: `time format should be HH:mm`
    },
    price: {type: `number`, required: true, min: 1, max: 100000},
    rooms: {type: `number`, required: true, min: 1, max: 1000},
    guests: {type: `number`, required: true, min: 1, max: 10},
    features(cb) {
      if (this.value.length) {
        const result = this.value.every((elem) => Data.FEATURES.includes(elem));
        if (!result) {
          this.raise(`should contain only: ${Data.FEATURES}`);
        }
      }
      cb();
    },
    avatar: {type: `isImage`, required: false},
    photo: {type: `isImage`, required: false}
  }
};

const schema = new Schema(descriptor);

const validate = (source) => {
  return new Promise((resolve, reject) => {
    let errors = [];

    schema.validate(source, (err, response) => {
      if (err) {
        reject(err);
      } else if (response) {
        errors = response.errors.map((error) => {
          return {
            fieldName: error.field,
            fieldValue: error.value,
            errorMessage: error.message
          };
        });
      }

      if (errors.length) {
        reject(new ValidationError(errors));
      } else {
        resolve();
      }
    });
  });
};


module.exports = validate;
