const express = require(`express`);
const offersRouter = require(`./offers/route`);

const app = express();

app.use(express.static(`static`));

app.use(`/api/offers`, offersRouter());


const PORT = 3000;
const HOSTNAME = `127.0.0.1`;

module.exports = {
  name: `server`,
  description: `runs local server`,
  execute(port) {
    app.listen(port || PORT, HOSTNAME, () => {
      console.log(`server started at http://${HOSTNAME}:${port || PORT}/`);
    });
  },
  app
};
