const help = require(`./cli/help.js`);
const author = require(`./cli/author.js`);
const version = require(`./cli/version.js`);
const license = require(`./cli/license.js`);
const description = require(`./cli/description.js`);
const generate = require(`./cli/generate.js`);
const server = require(`./server/server.js`);

const prompt = () => {
  let args = [];
  let commands = [];

  commands.push(server, help, author, version, license, description, generate);

  if (process.argv.length === 2) {
    args.push(`greeting`);
  } else {
    args = process.argv.slice(2);
  }

  let cmdFiltred = commands.find((obj) => (`--` + obj.name) === args[0]);

  if (cmdFiltred) {
    cmdFiltred.execute(args[1], args[2], args[3]);
  } else if (args[0] === `greeting`) {
    server.execute();
  } else {
    console.error(`Неизвестная команда! "${args[0]}"\n` +
      `Чтобы прочитать правила использования приложения, наберите «--help».`);
    process.exit(1);
  }
};

module.exports = prompt;
