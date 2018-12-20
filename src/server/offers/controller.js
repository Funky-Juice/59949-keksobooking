const OffersModel = require(`./model`);
const Data = require(`../../data/data`);
const validate = require(`./validation`);
const createStreamFromBuffer = require(`./buffer-to-stream`);
const imageStore = require(`../images/store`);

const {getFilteredData, nameCheck, stringToInt, filterValues} = require(`../../../util/util`);
const {formatOfferData} = require(`../../../util/service`);

const asyncFunc = (fn) => (req, res, next) => fn(req, res, next).catch(next);


module.exports.getAll = asyncFunc(async (req, res) => {
  let offers = await getFilteredData(await OffersModel.getAllOffers(), req.query.skip, req.query.limit);

  offers.data = offers.data.map((obj) => {
    return formatOfferData(obj);
  });

  res.send(offers);
});

module.exports.getByDate = asyncFunc(async (req, res) => {
  const reqDate = await req.params[`date`];
  const offer = await OffersModel.getOfferByDate(parseInt(reqDate, 10));

  res.send(formatOfferData(offer));
});

module.exports.getAvatarByDate = asyncFunc(async (req, res) => {
  const reqDate = req.params.date;
  const offer = await OffersModel.getOfferByDate(parseInt(reqDate, 10));

  const {info, stream} = await imageStore.getImage(offer.avatar);

  res.set(`content-type`, info.contentType);
  res.set(`content-length`, info.length);
  res.status(200);
  stream.pipe(res);
});

module.exports.create = asyncFunc(async (req, res) => {

  const source = {
    name: nameCheck(req.body.name, Data.NAMES),
    title: req.body.title,
    type: req.body.type,
    price: stringToInt(req.body.price),
    address: req.body.address,
    checkin: req.body.checkin,
    checkout: req.body.checkout,
    rooms: stringToInt(req.body.rooms),
    guests: stringToInt(req.body.guests),
    features: filterValues(req.body.features),
    description: req.body.description,
    avatar: req.files.avatar,
    photo: req.files.photo,
    date: new Date().getTime()
  };

  let coordinates = source.address.split(`,`);

  source.location = {
    x: stringToInt(coordinates[0]),
    y: stringToInt(coordinates[1])
  };

  const avatar = (source.avatar ? source.avatar[0] : null);

  try {
    await validate(source);

    if (avatar) {
      const avatarInfo = {
        filename: `api/offers/${source.date}/avatar`,
        mimetype: avatar.mimetype
      };

      await imageStore.saveImage(avatarInfo.filename, avatarInfo.mimetype, createStreamFromBuffer(avatar.buffer));
      source.avatar = avatarInfo.filename;
    }

    if (source.photo) {
      let photos = [];

      source.photo.forEach(async (obj, i) => {
        const photoInfo = {
          filename: `api/offers/${source.date}/photo/${i}`,
          mimetype: obj.mimetype
        };

        await imageStore.saveImage(photoInfo.filename, photoInfo.mimetype, createStreamFromBuffer(obj.buffer))
            .then(photos.push(photoInfo.filename));
      });

      source.photo = photos;
    }

    await OffersModel.createOffer(source);
    res.send(source);

  } catch (err) {
    console.log(err);

    res.status(400);
    res.send(err);
  }
});
