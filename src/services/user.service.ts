import { roleMap } from 'src/helpers';

import { IEmail, IIdentification, IRole, UserData } from './types';
import { findOneUserByEmail, findOneUserById, makeUserData } from './utils';

export type MeUserDto = IEmail;

export type UpdateUserRoleDto = IIdentification & IRole;

export type DeleteUserRoleDto = IIdentification;

export class UserService {
  public async me(dto: MeUserDto): Promise<UserData> {
    const { email } = dto;
    const user = await findOneUserByEmail(email);
    return makeUserData(user);
  }

  public async updateRole(dto: UpdateUserRoleDto): Promise<UserData> {
    const { id, role: roleString } = dto;
    const role = roleString && roleMap[roleString];
    const user = await findOneUserById(id);
    await user.update({ role });
    return makeUserData(user);
  }

  public async deleteUser(dto: DeleteUserRoleDto): Promise<void> {
    const { id } = dto;
    const user = await findOneUserById(id);
    await user.destroy();
  }
}
