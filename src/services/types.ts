import { roleMap } from 'src/helpers';

export interface IMessage {
  message: string;
}
export interface IEmail {
  readonly email: string;
}

export interface IPassword {
  readonly password: string;
}

export interface IRole {
  readonly role: keyof typeof roleMap;
}

export interface IIdentification {
  readonly id: string;
}

export interface IToken {
  readonly token: string;
}

// TODO: разобрать на более мелкие
export interface IBook {
  readonly title: string;
  readonly author: string;
  readonly publicationDate: number;
  readonly genres: Array<string>;
}

export type UserData = {
  readonly id: number;
  readonly email: string;
  readonly role: keyof typeof roleMap;
};

export type BookData = {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly publicationDate: string;
  readonly genres: Array<string>;
};

export interface IUserData {
  userData: UserData;
}

export interface IBookData {
  bookData: BookData;
}

export interface IBooksData {
  booksData: Array<BookData>;
}
