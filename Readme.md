# Кексобукинг

Node.js/Express API объявлений о сдаче жилья.

Точка входа — [`index.js`](index.js), HTTP-сервер — [`src/server/server.js`](src/server/server.js). Нужен Node.js `>=24` (поле `engines` в [`package.json`](package.json)).

## Запуск

```bash
npm install
```

Скопируйте [`.env.example`](.env.example) в `.env` и заполните `DB_HOST` (см. раздел про базу данных).

```bash
npm start
```

Эквивалент: `node index`. Сервер слушает `SERVER_HOST` и `SERVER_PORT`. Если переменные не заданы, адрес по умолчанию — `http://127.0.0.1:3000`.

Тесты (Mocha):

```bash
npm test
```

Команды CLI (см. [`src/cli/help.js`](src/cli/help.js)):

| Команда | Назначение |
| --- | --- |
| `--help` | список команд |
| `--version` | версия приложения |
| `--author` | автор |
| `--license` | лицензия |
| `--description` | описание |
| `--generate num path wr` | генерация JSON с объявлениями (`num` — количество, `path` — путь к файлу, `wr` — перезаписать существующий файл) |

Пример: `node index --help`.

## Версионирование

Версия хранится в поле `version` файла [`package.json`](package.json). Сейчас это `0.0.1`.

`node index --version` читает это поле через [`src/cli/version.js`](src/cli/version.js) и печатает номер в формате semver.

Номер меняют вручную в `package.json` при релизе (`MAJOR.MINOR.PATCH`).

## База данных

MongoDB, имя базы — `keksobooking` ([`src/database/database.js`](src/database/database.js)). Строка подключения — переменная `DB_HOST`.

Кластер размещён в [MongoDB Atlas](https://cloud.mongodb.com/). URI берут там же: **Connect → Drivers**, затем подставляют его в `.env`:

```
DB_HOST=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
```

Пароль и полный URI в этот файл не копируют.

Картинки объявлений хранятся в GridFS, бакет `images`.

## Переменные окружения

Шаблон — [`.env.example`](.env.example). Файл `.env` в репозиторий не коммитят.

| Переменная | Назначение | Пример |
| --- | --- | --- |
| `DB_HOST` | строка подключения к MongoDB | `mongodb://127.0.0.1:27017` или URI Atlas |
| `SERVER_HOST` | хост HTTP-сервера | `127.0.0.1` |
| `SERVER_PORT` | порт HTTP-сервера | `3000` |
| `NODE_ENV` | режим работы (`development` / `production`) | `development` |
