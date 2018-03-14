const OffersModel = require(`./model`);
const Data = require(`../../data/data`);
const validate = require(`./validation`);
const {getFilteredData, nameCheck, stringToInt, filterValues} = require(`../../../util/util`);
const {generateEntity} = require(`../../generator/generator`);


const asyncFunc = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const offers = generateEntity();


module.exports.getAll = asyncFunc(async (req, res) => {
  let skip = 0;
  let limit = 20;

  if (req.query.skip) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit, 10);
  }

  res.send(await getFilteredData(await OffersModel.getAllOffers(), skip, limit));
});


module.exports.getByDate = async (req, res) => {
  const reqDate = await req.params[`date`];
  const offer = await offers.find((obj) => obj.date === reqDate);

  if (!offer) {
    res.status(404);
    res.set(`Content-Type`, `text/html`);
    res.end();
  } else {
    res.send(offer);
  }
};


module.exports.create = async (req, res) => {

  const source = {
    name: nameCheck(req.body.name, Data.NAMES),
    title: req.body.title,
    type: req.body.type,
    price: stringToInt(req.body.price),
    address: req.body.address,
    timein: req.body.timein,
    timeout: req.body.timeout,
    rooms: stringToInt(req.body.rooms),
    guests: stringToInt(req.body.guests),
    features: filterValues(req.body.features),
    description: req.body.description,
    avatar: req.files.avatar,
    preview: req.files.preview
  };

  try {
    await validate(source);

    if (source.avatar) {
      source.avatar.map((it) => {
        delete it.buffer;
      });
    }
    if (source.preview) {
      source.preview.map((it) => {
        delete it.buffer;
      });
    }

    await OffersModel.create(source);

    res.send(source);
  } catch (err) {
    console.log(err);

    res.status(400);
    res.send(err);
  }
};
