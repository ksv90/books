import type { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Middleware = (req: Request<any>, res: Response<any, any>, next: NextFunction) => void | Promise<void>;

export interface IControllerOptions {
  readonly path?: string;
}
