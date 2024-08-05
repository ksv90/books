import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors-enhanced';

import { makeErrorMessage } from './utils';

export function createResponseErrorHandler(): ErrorRequestHandler {
  return (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: makeErrorMessage(error) });
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCustomErrorHandler<TCustomError extends new (...args: any) => InstanceType<TCustomError>>(
  CustomError: TCustomError,
  handler: (error: InstanceType<TCustomError>, req: Request, res: Response, next: NextFunction) => void,
): ErrorRequestHandler {
  return (error: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof CustomError) {
      handler(error, req, res, next);
    } else {
      next(error);
    }
  };
}
