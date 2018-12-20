const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const ValidationError = require(`../validation-error`);
const offersController = require(`./controller`);

const upload = multer({storage: multer.memoryStorage()});

const offersRouter = new Router();

offersRouter.use(bodyParser.json());


offersRouter.get(``, offersController.getAll);

offersRouter.get(`/:date`, offersController.getByDate);


const formFields = [
  {name: `avatar`, maxCount: 1},
  {name: `photo`, maxCount: 3}
];

offersRouter.post(``, upload.fields(formFields), offersController.create);

offersRouter.get(`/:date/avatar`, offersController.getAvatarByDate);


offersRouter.use((exception, req, res, next) => {
  let data = exception;
  if (exception instanceof ValidationError) {
    data = exception.errors;
  }
  res.status(400).send(data);
  next();
});


module.exports = offersRouter;
