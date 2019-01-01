const Data = require(`../../src/data/data`);
const util = require(`../../src/util/util`);


const dataTemplate = () => {
  const coordinateX = util.getRandomInt(300, 900);
  const coordinateY = util.getRandomInt(150, 500);

  return {
    'name': util.getRandomFromArr(Data.NAMES),
    'avatar': util.getRandomPic(),
    'title': util.getRandomFromArr(Data.TITLE),
    'address': `${coordinateX}, ${coordinateY}`,
    'price': util.getRandomInt(1000, 1000000),
    'type': util.getRandomFromArr(Data.TYPE),
    'rooms': util.getRandomInt(1, 5),
    'guests': util.getRandomInt(1, 15),
    'checkin': util.getRandomFromArr(Data.TIME),
    'checkout': util.getRandomFromArr(Data.TIME),
    'features': util.getRandomValuesFromArr(Data.FEATURES),
    'description': `Маленькая чистая квартира на краю парка.`,
    'photo': util.getShuffledArray(Data.PHOTOS),
    'location': {
      'x': coordinateX,
      'y': coordinateY
    },
    'date': new Date().getTime()
  };
};

const generateEntity = (objectsCount = 1) => {
  const data = [];

  for (let i = 0; i < objectsCount; i++) {
    data.push(dataTemplate());
  }

  return data;
};

module.exports = {
  generateEntity
};
