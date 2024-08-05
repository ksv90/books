import { env, stdin } from 'node:process';

import { MainController } from './app';
import { DataBase, Server } from './core';
import { BookModel, UserModel } from './models';

const { PORT, NODE_ENV, WHITE_LIST, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, JWT_SECRET_KEY } = env;

// eslint-disable-next-line no-void, @typescript-eslint/explicit-function-return-type
void (async function main() {
  const server = new Server({
    port: Number(PORT),
  });

  const dataBase = new DataBase({
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
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
    stdin.write(`\n\tThe server runs: http://localhost:${PORT}/\n`);
  }
})();
