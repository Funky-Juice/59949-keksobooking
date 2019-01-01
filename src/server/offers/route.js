const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const {asyncMiddleware} = require(`../../util/util`);
const dataRenderer = require(`../../util/data-renderer`);

const OffersController = require(`./controller`);

const ImagesStore = require(`../images/store`);
const OffersModel = require(`./model`);

const upload = multer({storage: multer.memoryStorage()});

const offersRouter = new Router();

offersRouter.use(bodyParser.json());


const initRouter = (model = OffersModel, imgStore = ImagesStore) => {

  const controller = new OffersController(model, imgStore);

  const formFields = [
    {name: `avatar`},
    {name: `photo`}
  ];

  offersRouter.get(``, asyncMiddleware(controller.getAll()));

  offersRouter.get(`/:date`, asyncMiddleware(controller.getByDate()));

  offersRouter.get(`/:date/avatar`, asyncMiddleware(controller.getAvatarByDate()));

  offersRouter.get(`/:date/photo/:index`, asyncMiddleware(controller.getPhotoByDate()));

  offersRouter.post(``, upload.fields(formFields), asyncMiddleware(controller.createOffer()));

  offersRouter.use((exception, req, res, next) => {
    dataRenderer.renderException(req, res, exception);
    next();
  });

  return offersRouter;
};

module.exports = initRouter;
