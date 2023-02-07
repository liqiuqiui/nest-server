import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enum/role.enum';
import { Request } from 'express';
import { User } from '@/modules/user/entities/user.entity';
import { ROLES_KEY } from '../constants/role.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    const req = context.switchToHttp().getRequest<Request & { user: User }>();
    const user = req.user;

    const role = user.role;

    return requiredRoles.includes(role);
  }
}
