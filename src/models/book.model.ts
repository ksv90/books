import { DataTypes, ModelAttributeColumnOptions, ValidationError } from 'sequelize';
import { CustomModel } from 'src/core';

export interface IBookAttributes {
  readonly title: string;
  readonly author: string;
  readonly publicationDate: number;
  readonly genres: ReadonlyArray<string>;
}

export interface IBookModel {
  readonly id: number;
  readonly title: string;
  readonly author: string;
  readonly publicationDate: number;
  readonly genres: Array<string>;
}

export class BookModel extends CustomModel<IBookModel, IBookAttributes> {
  declare id: number;

  declare title: string;

  declare author: string;

  declare publicationDate: string;

  declare genres: Array<string>;

  static name = 'book';

  static attributes: Record<keyof IBookModel, ModelAttributeColumnOptions> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, unique: true },
    author: { type: DataTypes.STRING },
    publicationDate: { type: DataTypes.DATE },
    genres: { type: DataTypes.ARRAY(DataTypes.STRING) },
  };
}

export type T = ValidationError;
