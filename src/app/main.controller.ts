import cors from 'cors';
import { json, urlencoded } from 'express';

import { AuthController, BookController, UserController } from '../controllers';
import { BaseController, createResponseErrorHandler, IControllerOptions } from '../core';
import { dataBaseValidationErrorHandler } from '../helpers/error-handlers';

export interface IMainControllerOptions extends IControllerOptions {
  whiteList: ReadonlyArray<string>;
  secretKey: string;
}

export class MainController extends BaseController {
  constructor(options: IMainControllerOptions) {
    super(options);
    this.addMiddleware(cors({ origin: options.whiteList as Array<string> }));
    this.addMiddleware(json());
    this.addMiddleware(urlencoded({ extended: false }));
    this.addController(new BookController({ secretKey: options.secretKey }));
    this.addController(new UserController({ secretKey: options.secretKey }));
    this.addController(new AuthController({ secretKey: options.secretKey }));
    this.addErrorHandler(dataBaseValidationErrorHandler, createResponseErrorHandler());
  }
}
