const Data = require(`../../data/data`);
const logger = require(`../../logger`);
const validate = require(`./validation`);
const dataRenderer = require(`../../util/data-renderer`);
const NotFoundError = require(`../error/not-found-error.js`);
const createStreamFromBuffer = require(`../../util/buffer-to-stream`);

const {getFilteredData, nameCheck, stringToInt, filterValues} = require(`../../util/util`);
const {formatOfferData} = require(`../../util/service`);

class OffersController {
  constructor(model, imageStore) {
    this.model = model;
    this.imageStore = imageStore;
  }

  getAll() {
    return async (req, res) => {
      let offers = await getFilteredData(await this.model.getAllOffers(), req.query.skip, req.query.limit);

      offers.data = offers.data.map((obj) => {
        return formatOfferData(obj);
      });

      res.send(offers);
    };
  }

  getByDate() {
    return async (req, res) => {
      const reqDate = await req.params[`date`];
      const offer = await this.model.getOfferByDate(parseInt(reqDate, 10));

      if (!offer) {
        throw new NotFoundError(`Offer with date ${reqDate} not found`);
      }
      res.send(formatOfferData(offer));
    };
  }

  getAvatarByDate() {
    return async (req, res) => {
      const reqDate = req.params.date;
      const offer = await this.model.getOfferByDate(stringToInt(reqDate));

      if (!offer) {
        throw new NotFoundError(`Avatar was not found`);
      }
      const {info, stream} = await this.imageStore.getImage(offer.avatar);

      res.set(`content-type`, info.contentType);
      res.set(`content-length`, info.length);
      res.status(200);
      stream.pipe(res);
    };
  }

  getPhotoByDate() {
    return async (req, res) => {
      const reqDate = req.params.date;
      const photoIndex = req.params.index;
      const offer = await this.model.getOfferByDate(stringToInt(reqDate));

      if (!offer) {
        throw new NotFoundError(`Photo was not found`);
      }

      const file = await this.imageStore.getImage(offer.photo[photoIndex]);

      if (!file) {
        throw new NotFoundError(`Photo was not found`);
      }

      res.set(`content-type`, file.info.contentType);
      res.set(`content-length`, file.info.length);
      res.status(200);
      file.stream.pipe(res);
    };
  }

  createOffer() {
    return async (req, res) => {

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

      try {
        await validate(source);

        const coordinates = source.address.split(`,`);

        source.location = {
          x: stringToInt(coordinates[0]),
          y: stringToInt(coordinates[1])
        };

        const avatar = (source.avatar ? source.avatar[0] : null);

        if (avatar) {
          const avatarInfo = {
            filename: `api/offers/${source.date}/avatar`,
            mimetype: avatar.mimetype
          };

          await this.imageStore.saveImage(avatarInfo.filename, avatarInfo.mimetype, createStreamFromBuffer(avatar.buffer));
          source.avatar = avatarInfo.filename;
        }

        if (source.photo) {
          let photos = [];

          source.photo.forEach(async (obj, i) => {
            const photoInfo = {
              filename: `api/offers/${source.date}/photo/${i}`,
              mimetype: obj.mimetype
            };

            await this.imageStore.saveImage(photoInfo.filename, photoInfo.mimetype, createStreamFromBuffer(obj.buffer))
                .then(photos.push(photoInfo.filename));
          });

          source.photo = photos;
        }

        await this.model.createOffer(source);
        dataRenderer.renderDataSuccess(req, res, source);

      } catch (err) {
        logger.info(`Create offer req.body: `, req.body);
        logger.error(`Create offer`, err);

        dataRenderer.renderDataError(req, res, err);
      }
    };
  }
}

module.exports = OffersController;
