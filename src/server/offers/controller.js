const OffersModel = require(`./model`);
const Data = require(`../../data/data`);
const validate = require(`./validation`);
const createStreamFromBuffer = require(`./buffer-to-stream`);
const imageStore = require(`../images/store`);

const {getFilteredData, nameCheck, stringToInt, filterValues} = require(`../../../util/util`);

const asyncFunc = (fn) => (req, res, next) => fn(req, res, next).catch(next);


module.exports.getAll = asyncFunc(async (req, res) => {
  res.send(await getFilteredData(await OffersModel.getAllOffers(), req.query.skip, req.query.limit));
});

module.exports.getByDate = async (req, res) => {
  const reqDate = await req.params[`date`];

  res.send(await getFilteredData(await OffersModel.getOffersByDate(parseInt(reqDate, 10)), req.query.skip, req.query.limit));
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
    preview: req.files.preview,
    date: new Date().getTime()
  };

  const avatar = (req.files.avatar ? req.files.avatar[0] : null);

  try {
    await validate(source);

    if (avatar) {
      const avatarInfo = {
        filename: `${source.date}/avatar`,
        mimetype: avatar.mimetype
      };

      await imageStore.saveImage(avatarInfo.filename, avatarInfo.mimetype, createStreamFromBuffer(avatar.buffer));
      source.avatar = avatarInfo;
    }

    await OffersModel.createOffer(source);
    res.send(source);

  } catch (err) {
    console.log(err);

    res.status(400);
    res.send(err);
  }
};
