import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from 'http-errors-enhanced';
import { checkBearerAuth, Middleware } from 'src/core';
import { roleMap } from 'src/helpers';
import { AuthService, IUserData } from 'src/services';

export function checkAuth(secretKey: string): Middleware {
  const authService = new AuthService(secretKey);
  return checkBearerAuth(async (token, _req, res: Response<undefined, IUserData>) => {
    const userData = await authService.verify({ token });
    res.locals.userData = userData;
    return true;
  });
}

export function checkAccess(testedRole: number): Middleware {
  return async (_req: Request, res: Response<undefined, IUserData>, next: NextFunction): Promise<void> => {
    const { userData } = res.locals;
    if (testedRole & roleMap[userData.role]) {
      next();
    } else {
      next(new ForbiddenError('нет доступа'));
    }
  };
}
