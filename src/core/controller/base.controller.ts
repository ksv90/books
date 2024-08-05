import { join } from 'node:path';

import { ErrorRequestHandler, type RequestHandler, Router } from 'express';

import { IControllerOptions, Middleware } from './types';

export abstract class BaseController {
  #path: string;

  #created = false;

  #router: Router;

  #registeredControllers = new Map<string, BaseController>();

  #errorHandlers = new Set<ErrorRequestHandler>();

  constructor(options?: IControllerOptions) {
    this.#path = join('/', options?.path ?? '');
    this.#router = Router();
  }

  public get path(): string {
    return this.#path;
  }

  public get created(): boolean {
    return this.#created;
  }

  public addMiddleware(...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.use(...handlers);
  }

  public addController(...controllers: Array<BaseController>): void {
    controllers.forEach((controller) => {
      if (this.#registeredControllers.has(controller.path)) {
        throw new Error(`в контроллере ${this.path} уже зарегистрирован маршрут ${controller.path}`);
      }
      this.#registeredControllers.set(controller.path, controller);
    });
  }

  public addErrorHandler(...errorHandlers: Array<ErrorRequestHandler>): void {
    errorHandlers.forEach((errorHandler) => {
      this.#errorHandlers.add(errorHandler);
    });
  }

  public async createRouter(): Promise<Router> {
    if (this.#created) {
      throw new Error(`маршрут ${this.#path} уже создан`);
    }
    this.#created = true;
    const routes = await Promise.all(
      Array.from(this.#registeredControllers).map(async ([, route]) => route.createRouter()),
    );
    routes.forEach((route) => this.#router.use(this.#path, route));
    this.#errorHandlers.forEach((errorHandler) => this.#router.use(errorHandler));
    return this.#router;
  }

  public get(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.get(join(this.#path, endPoint), ...handlers);
  }

  public post(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.post(join(this.#path, endPoint), ...handlers);
  }

  public put(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.put(join(this.#path, endPoint), ...handlers);
  }

  public delete(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.delete(join(this.#path, endPoint), ...handlers);
  }

  public options(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.options(join(this.#path, endPoint), ...handlers);
  }

  public head(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.head(join(this.#path, endPoint), ...handlers);
  }

  public patch(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.patch(join(this.#path, endPoint), ...handlers);
  }

  public all(endPoint: string, ...middlewares: Array<Middleware>): void {
    const handlers = middlewares.map((middleware) => this.convertMiddleware(middleware));
    this.#router.all(join(this.#path, endPoint), ...handlers);
  }

  protected convertMiddleware(middleware: Middleware): (...args: Parameters<RequestHandler>) => void {
    return (...[request, response, next]) => {
      try {
        const returnData = middleware(request, response, next);
        if (returnData instanceof Promise) returnData.catch(next);
      } catch (error) {
        next(error);
      }
    };
  }
}
