import { Dialect, ModelStatic, Sequelize } from 'sequelize';

import { CustomModel } from './model';

export interface IDataBaseOptions {
  readonly database: string;
  readonly username: string;
  readonly password: string;
  readonly host: string;
  readonly port: number;
  readonly dialect: Dialect;
  readonly models: ReadonlyArray<ModelStatic<CustomModel> & { connect(db: Sequelize): void }>;
}
