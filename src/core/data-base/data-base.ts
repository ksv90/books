import { Sequelize } from 'sequelize';

import { IDataBaseOptions } from './types';

export class DataBase {
  #db: Sequelize;

  #models: IDataBaseOptions['models'];

  constructor(options: IDataBaseOptions) {
    const { database, username, password, host, port, dialect } = options;
    this.#db = new Sequelize({ database, username, password, host, port, dialect });
    this.#models = options.models;
  }

  public async connect(): Promise<void> {
    this.#models.forEach((model) => {
      model.connect(this.#db);
    });
    await this.#db.authenticate();
    await this.#db.sync();
  }
}
