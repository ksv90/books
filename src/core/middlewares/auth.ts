/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'http-errors-enhanced';

import { Middleware } from '../controller';

export type VerifyBearerAuth = (
  token: string,
  req: Request<any>,
  res: Response<any, any>,
  next: NextFunction,
) => Promise<boolean>;

export function checkBearerAuth(verify: VerifyBearerAuth): Middleware {
  return async (req, res, next) => {
    if (req.method === 'OPTIONS') {
      next();
      return;
    }
    const [, token] = req.headers.authorization?.split(' ') ?? [];
    if (!token) {
      next(new UnauthorizedError('пользователь не авторизован'));
      return;
    }
    try {
      const access = await verify(token, req, res, next);
      if (!access) {
        throw new UnauthorizedError('верификация не пройдена');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
