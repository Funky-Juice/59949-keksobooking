const express = require(`express`);
const offersRouter = require(`./offers/route`);

const app = express();

app.use(express.static(`static`));

app.use(`/api/offers`, offersRouter());


const HOSTNAME = process.env.SERVER_HOST || `127.0.0.1`;
const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;

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
