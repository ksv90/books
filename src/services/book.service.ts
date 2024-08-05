import { NotFoundError } from 'http-errors-enhanced';
import { BookModel } from 'src/models';

import { BookData, IBook, IIdentification } from './types';
import { makeBookData } from './utils';

export type OneBookDto = IIdentification;

export type CreateBookDto = IBook;

export type UpdateBookDto = IIdentification & IBook;

export class BookService {
  public async getOne(dto: OneBookDto): Promise<BookData> {
    const { id } = dto;
    const book = await this.findOne(id);
    return makeBookData(book);
  }

  public async getAll(): Promise<Array<BookData>> {
    const books = await BookModel.findAll();
    return books.map((book) => makeBookData(book));
  }

  public async create(dto: CreateBookDto): Promise<BookData> {
    const { title, author, publicationDate, genres } = dto;
    const book = await BookModel.create({ title, author, publicationDate, genres });
    return makeBookData(book);
  }

  public async update(dto: Omit<UpdateBookDto, 'publicationDate'>): Promise<BookData> {
    const { id, title, author, genres } = dto;
    const book = await this.findOne(id);
    await book.update({ title, author, genres });
    return makeBookData(book);
  }

  public async deleteOne(dto: OneBookDto): Promise<void> {
    const { id } = dto;
    const book = await this.findOne(id);
    await book.destroy();
  }

  protected async findOne(id: string): Promise<BookModel> {
    const book = await BookModel.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundError(`книга с id "${id}" не найдена`);
    }
    return book;
  }
}
