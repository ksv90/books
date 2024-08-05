import process from 'node:process';

import { MainController } from './app';
import { DataBase, Server } from './core';
import { BookModel, UserModel } from './models';

const {
  PORT,
  NODE_ENV,
  WHITE_LIST,
  JWT_SECRET_KEY,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

// eslint-disable-next-line no-void, @typescript-eslint/explicit-function-return-type
void (async function main() {
  const server = new Server({
    port: Number(PORT),
  });

  const dataBase = new DataBase({
    database: POSTGRES_DB,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),
    dialect: 'postgres',
    models: [UserModel, BookModel],
  });

  const mainController = new MainController({
    whiteList: WHITE_LIST?.split(/[,;]/g),
    secretKey: JWT_SECRET_KEY,
  });

  await dataBase.connect();
  await server.listen(mainController);

  if (NODE_ENV !== 'production') {
    process.stdout.write(`\n\tThe server runs: http://localhost:${PORT}/\n`);
  }
})();
