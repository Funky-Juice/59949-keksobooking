const {generateEntity} = require(`../../test/offers/generator`);

const fs = require(`fs`);
const util = require(`util`);
const writeFile = util.promisify(fs.writeFile);
const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};


module.exports = {
  name: `generate`,
  description: `generates data for project`,
  execute(objectsCount, filePath, overwrite) {
    if (!objectsCount) {
      console.log(`укажите количество генерируемых обьектов`);
      process.exit(1);
    } else if (!filePath) {
      console.log(`укажите путь до файла и его название с раширением .json`);
      process.exit(1);
    }

    const fileFullPath = `${process.cwd()}/${filePath}`;

    if (!overwrite && fs.existsSync(fileFullPath)) {
      console.log(`Такой файл уже существует!\n` + `Если хотите перезаписать его, добавьте в конце ключ «wr»`);
      process.exit(1);
    }

    const dataArr = generateEntity(objectsCount);

    return writeFile(fileFullPath, JSON.stringify(dataArr), fileWriteOptions)
        .then(() => console.log(`JSON сгенерирован!`))
        .catch((err) => console.log(err));
  }
};
