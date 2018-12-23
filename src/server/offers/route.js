const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);

const ValidationError = require(`../validation-error`);
const OffersController = require(`./controller`);

const ImagesStore = require(`../images/store`);
const OffersModel = require(`./model`);

const upload = multer({storage: multer.memoryStorage()});

const offersRouter = new Router();

const controller = new OffersController(OffersModel, ImagesStore);

offersRouter.use(bodyParser.json());

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);


const formFields = [
  {name: `avatar`, maxCount: 1},
  {name: `photo`, maxCount: 3}
];

offersRouter.post(``, upload.fields(formFields), asyncMiddleware(controller.createOffer()));

offersRouter.get(``, asyncMiddleware(controller.getAll()));

offersRouter.get(`/:date`, asyncMiddleware(controller.getByDate()));

offersRouter.get(`/:date/avatar`, asyncMiddleware(controller.getAvatarByDate()));

offersRouter.get(`/:date/photo/:index`, asyncMiddleware(controller.getPhotoByDate()));

offersRouter.use((exception, req, res, next) => {
  let data = exception;
  if (exception instanceof ValidationError) {
    data = exception.errors;
  }
  res.status(400).send(data);
  next();
});


module.exports = offersRouter;
