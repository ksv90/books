import { DataTypes, ModelAttributeColumnOptions } from 'sequelize';
import { CustomModel } from 'src/core';
import { roleMap } from 'src/helpers';

export interface IUserModelAttributes {
  readonly email: string;
  readonly password: string;
  readonly role?: number;
}

export interface IUserModel {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly role: number;
}

export class UserModel extends CustomModel<IUserModel, IUserModelAttributes> {
  declare readonly id: number;

  declare readonly email: string;

  declare readonly password: string;

  declare readonly role: keyof typeof roleMap;

  static name = 'user';

  static attributes: Record<keyof IUserModel, ModelAttributeColumnOptions> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: roleMap.USER,
      get(this: UserModel): keyof typeof roleMap {
        const roleNumber = this.getDataValue('role');
        const [roleString] = Object.entries(roleMap).find(([, role]) => role === roleNumber) ?? [];
        return (roleString as keyof typeof roleMap) ?? 'USER';
      },
    },
  };
}
