const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const logger = require(`../../logger`);
const {asyncMiddleware} = require(`../../util/util`);
const dataRenderer = require(`../../util/data-renderer`);

const OffersController = require(`./controller`);

const ImagesStore = require(`../images/store`);
const OffersModel = require(`./model`);

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = file.mimetype;
    if (ext !== `image/png` && ext !== `image/jpg` && ext !== `image/jpeg`) {
      return cb(new multer.MulterError(`Only images are allowed`, file.fieldname));
    }
    return cb(null, true);
  },
  limits: {
    fileSize: 1000000 // 1Mb
  }
});

const offersRouter = new Router();

offersRouter.use(bodyParser.json());

const initRouter = (model = OffersModel, imgStore = ImagesStore) => {

  offersRouter.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
    next();
  });

  const controller = new OffersController(model, imgStore);

  const formFields = [
    {name: `avatar`, maxCount: 1},
    {name: `photos`, maxCount: 3}
  ];

  offersRouter.get(``, asyncMiddleware(controller.getAll()));

  offersRouter.get(`/:date`, asyncMiddleware(controller.getByDate()));

  offersRouter.get(`/:date/avatar`, asyncMiddleware(controller.getAvatarByDate()));

  offersRouter.get(`/:date/photo/:index`, asyncMiddleware(controller.getPhotoByDate()));

  offersRouter.post(``, upload.fields(formFields), asyncMiddleware(controller.createOffer()));

  offersRouter.use((exception, req, res, next) => {
    logger.error(`Create offer`, exception);
    dataRenderer.renderDataError(req, res, exception);
    next();
  });

  return offersRouter;
};

module.exports = initRouter;
