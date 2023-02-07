import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/role.constant';
import { Role } from '../enum/role.enum';

export const Roles = (...roles: Role[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
