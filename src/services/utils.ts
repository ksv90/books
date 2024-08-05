import { NotFoundError } from 'http-errors-enhanced';
import { BookModel, UserModel } from 'src/models';

import { BookData, UserData } from './types';

export function makeUserData(user: UserModel): UserData {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export function makeBookData(book: BookModel): BookData {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    genres: book.genres,
    publicationDate: book.publicationDate,
  };
}

export async function findOneUserByEmail(email: string, exception?: true): Promise<UserModel>;
export async function findOneUserByEmail(email: string, exception: false): Promise<UserModel | null>;
export async function findOneUserByEmail(email: string, exception = true): Promise<UserModel | null> {
  const user = await UserModel.findOne({ where: { email } });
  if (exception && !user) {
    throw new NotFoundError(`пользователь с email "${email}" не найден`);
  }
  return user;
}

export async function findOneUserById(id: string, exception?: true): Promise<UserModel>;
export async function findOneUserById(id: string, exception: false): Promise<UserModel | null>;
export async function findOneUserById(id: string, exception = true): Promise<UserModel | null> {
  const user = await UserModel.findOne({ where: { id } });
  if (exception && !user) {
    throw new NotFoundError(`пользователь с id "${id}" не найден`);
  }
  return user;
}
