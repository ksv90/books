import { NextFunction, Request, Response } from 'express';
import { BaseController, IControllerOptions } from 'src/core';
import { WRITE_ACCESS } from 'src/helpers';
import {
  AuthService,
  IEmail,
  IIdentification,
  IMessage,
  IPassword,
  IRole,
  IToken,
  IUserData,
  UserService,
} from 'src/services';

import { checkAccess, checkAuth } from './middlewares';

export interface IUserControllerOptions extends IControllerOptions {
  secretKey: string;
}

export class UserController extends BaseController {
  protected userService: UserService;

  protected authService: AuthService;

  constructor(options?: IUserControllerOptions) {
    const secretKey = options?.secretKey ?? '';
    super({ path: 'users', ...options });

    this.post('/register', this.register.bind(this));
    this.post('/login', this.login.bind(this));
    this.get('/me', checkAuth(secretKey), this.me.bind(this));
    this.put('/:id/role', checkAuth(secretKey), checkAccess(WRITE_ACCESS), this.updateRole.bind(this));
    this.delete('/:id', checkAuth(secretKey), checkAccess(WRITE_ACCESS), this.deleteUser.bind(this));

    this.userService = new UserService();
    this.authService = new AuthService(secretKey);
  }

  public async register(
    req: Request<undefined, undefined, IEmail & IPassword & IRole>,
    res: Response<IMessage & IToken>,
    next: NextFunction,
  ): Promise<void> {
    const { email, password, role } = req.body;
    try {
      const token = await this.authService.register({ email, password, role });
      res.status(201).json({ message: 'register', token });
    } catch (error) {
      next(error);
    }
  }

  public async login(
    req: Request<undefined, undefined, IEmail & IPassword>,
    res: Response<IMessage & IToken>,
    next: NextFunction,
  ): Promise<void> {
    const { email, password } = req.body;
    try {
      const token = await this.authService.login({ email, password });
      res.json({ message: 'login', token });
    } catch (error) {
      next(error);
    }
  }

  public async me(_req: Request, res: Response<IMessage & IUserData, IUserData>, next: NextFunction): Promise<void> {
    const { email } = res.locals.userData;
    try {
      const userData = await this.userService.me({ email });
      res.json({ message: 'me', userData });
    } catch (error) {
      next(error);
    }
  }

  public async updateRole(
    req: Request<IIdentification, undefined, IRole>,
    res: Response<IMessage & IUserData>,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;
    try {
      const userData = await this.userService.updateRole({ id, role });
      res.json({ message: 'updateRole', userData });
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(
    req: Request<IIdentification, undefined, IRole>,
    res: Response<IMessage & IUserData>,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    try {
      await this.userService.deleteUser({ id });
      res.end();
    } catch (error) {
      next(error);
    }
  }
}
