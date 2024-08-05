import { NextFunction, Request, Response } from 'express';
import { BaseController, IControllerOptions } from 'src/core';
import { AuthService, IEmail, IMessage, IPassword, IRole, IToken } from 'src/services';

export interface IAuthControllerOptions extends IControllerOptions {
  secretKey: string;
}

export class AuthController extends BaseController {
  protected authService: AuthService;

  constructor(options?: IAuthControllerOptions) {
    super({ path: 'auth', ...options });
    this.post('/register', this.register.bind(this));
    this.post('/login', this.login.bind(this));
    this.authService = new AuthService(options?.secretKey ?? '');
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
}
