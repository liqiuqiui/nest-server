import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../enum/role.enum';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';

export const Auth = (...roles: Role[]) => {
  const requiredRoles = roles.length
    ? roles
    : [Role.Admin, Role.User, Role.Repairman];

  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    Roles(...requiredRoles),
  );
};
