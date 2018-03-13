const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const {generateEntity} = require(`../../generator/generator`);
const ValidationError = require(`../validation-error`);
const {schema, callback} = require(`./validation`);
const {getFilteredData, nameCheck, stringToInt, filterValues} = require(`../../../util/util`);
const Data = require(`../../data/data`);
const OffersModel = require(`./model`);

const upload = multer({storage: multer.memoryStorage()});

const offers = generateEntity();

const offersRouter = new Router();

offersRouter.use(bodyParser.json());

offersRouter.model = OffersModel;

const asyncFunc = (fn) => (req, res, next) => fn(req, res, next).catch(next);


offersRouter.get(``, asyncFunc(async (req, res) => {
  let skip = 0;
  let limit = 20;

  if (req.query.skip) {
    skip = parseInt(req.query.skip, 10);
  }
  if (req.query.skip) {
    limit = parseInt(req.query.limit, 10);
  }

  res.send(await getFilteredData(await offersRouter.model.getAllOffers(), skip, limit));
}));

offersRouter.get(`/:date`, (req, res) => {
  const reqDate = req.params[`date`];
  const offer = offers.find((obj) => obj.date === reqDate);

  if (!offer) {
    res.status(404);
    res.set(`Content-Type`, `text/html`);
    res.end();
  } else {
    res.send(offer);
  }
});

const formFields = [
  {name: `avatar`, maxCount: 1},
  {name: `preview`, maxCount: 3}
];


offersRouter.post(``, upload.fields(formFields), async (req, res) => {

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

  await schema.validate(source, callback);

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

  await offersRouter.model.create(source);

  return res.send(source);
});


offersRouter.use((exception, req, res, next) => {
  let data = exception;
  if (exception instanceof ValidationError) {
    data = exception.errors;
  }
  res.status(400).send(data);
  next();
});


module.exports = offersRouter;
