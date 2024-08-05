import bcrypt from 'bcrypt';
import { BadRequestError } from 'http-errors-enhanced';
import jwt from 'jsonwebtoken';
import { roleMap } from 'src/helpers';
import { UserModel } from 'src/models';

import { IEmail, IPassword, IRole, IToken, UserData } from './types';
import { findOneUserByEmail } from './utils';

export type RegisterUserDto = IEmail & IPassword & Partial<IRole>;

export type LoginUserDto = IEmail & IPassword;

export type VerifyDto = IToken;

export class AuthService {
  constructor(protected readonly secretKey: string) {}

  public async register(dto: RegisterUserDto): Promise<string> {
    const { email, password: rawPassword, role: roleString } = dto;
    await findOneUserByEmail(email, false);
    const role = roleString && roleMap[roleString];
    const password = await this.hash(rawPassword);
    const user = await UserModel.create({ email, password, role });
    const token = this.generateUserToken(user);

    return token;
  }

  public async login(dto: LoginUserDto): Promise<string> {
    const { email, password: rawPassword } = dto;

    const user = await findOneUserByEmail(email);
    const password = await this.hash(rawPassword);

    if (await bcrypt.compare(password, user.password)) {
      throw new BadRequestError('не правильный пароль');
    }

    const token = this.generateUserToken(user);

    return token;
  }

  public async verify(dto: VerifyDto): Promise<UserData> {
    const { token } = dto;
    const userData = jwt.verify(token, this.secretKey) as UserData;
    await findOneUserByEmail(userData.email);
    return userData;
  }

  protected async hash(rawData: string): Promise<string> {
    const hashedData = await bcrypt.hash(rawData, 5);
    return hashedData;
  }

  protected generateUserToken(user: UserModel): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, this.secretKey, { expiresIn: '24h' });
  }
}
