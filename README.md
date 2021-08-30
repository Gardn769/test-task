## Description

Тестовое задание для бэкенд разработки.
После запуска сервера для просмотра документации по Api сервера, переходите по ссылке (http://localhost:3000/api/), там же можно будет и проверить работу с api.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker

```bash
# Сборка образа
$ docker-compose build

# Замените в файле ".env" следующие переменные используя свои данные:
PORT = 3000
POSTGRES_HOST = postgres
POSTGRES_USER = test
POSTGRES_DB = test
POSTGRES_PASSWORD = test
POSTGRES_PORT = 5432

# Запуск контейнера
$ docker-compose up
```

## License

Nest is [MIT licensed](LICENSE).
