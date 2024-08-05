import express from 'express';

import { BaseController } from '../controller';
import { IApplicationOptions } from './types';

export class Server {
  protected app: express.Express;

  constructor(protected readonly options: IApplicationOptions) {
    this.app = express();
  }

  public async listen(controller: BaseController): Promise<void> {
    this.app.use(await controller.createRouter());
    return new Promise((resolve, reject) => {
      try {
        this.app.listen(this.options.port, resolve);
      } catch (error) {
        reject(error);
      }
    });
  }
}
