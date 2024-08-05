import { NextFunction, Request, Response } from 'express';
import { BaseController, IControllerOptions } from 'src/core';
import { EDIT_ACCESS } from 'src/helpers';
import { BookService, IBook, IBookData, IBooksData, IIdentification, IMessage } from 'src/services';

import { checkAccess, checkAuth } from './middlewares';

export interface IBookControllerOptions extends IControllerOptions {
  secretKey: string;
}

export class BookController extends BaseController {
  protected bookService = new BookService();

  constructor(options?: IBookControllerOptions) {
    const secretKey = options?.secretKey ?? '';
    super({ path: 'books', ...options });

    this.get('/:id', this.getOne.bind(this));
    this.get('/', this.getAll.bind(this));
    this.post('/', checkAuth(secretKey), checkAccess(EDIT_ACCESS), this.create.bind(this));
    this.put('/:id', checkAuth(secretKey), checkAccess(EDIT_ACCESS), this.update.bind(this));
    this.delete('/:id', checkAuth(secretKey), checkAccess(EDIT_ACCESS), this.deleteOne.bind(this));
  }

  public async getOne(
    req: Request<IIdentification>,
    res: Response<IMessage & IBookData>,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    try {
      const bookData = await this.bookService.getOne({ id });
      res.json({ message: 'getOne', bookData });
    } catch (error) {
      next(error);
    }
  }

  public async getAll(_req: Request, res: Response<IMessage & IBooksData>, next: NextFunction): Promise<void> {
    try {
      const booksData = await this.bookService.getAll();
      res.json({ message: 'getAll', booksData });
    } catch (error) {
      next(error);
    }
  }

  public async create(
    req: Request<undefined, undefined, IBook>,
    res: Response<IMessage & IBookData>,
    next: NextFunction,
  ): Promise<void> {
    const { title, author, genres, publicationDate = Date.now() } = req.body;
    try {
      const bookData = await this.bookService.create({ title, author, publicationDate, genres });
      res.status(201).json({ message: 'create', bookData });
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request<IIdentification, undefined, Omit<IBook, 'publicationDate'>>,
    res: Response<IMessage & IBookData>,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;
    const { title, author, genres } = req.body;
    try {
      const bookData = await this.bookService.update({ id, title, author, genres });
      res.status(201).json({ message: 'update', bookData });
    } catch (error) {
      next(error);
    }
  }

  public async deleteOne(req: Request<IIdentification>, res: Response<undefined>, next: NextFunction): Promise<void> {
    const { id } = req.params;
    try {
      await this.bookService.deleteOne({ id });
      res.end();
    } catch (error) {
      next(error);
    }
  }
}
