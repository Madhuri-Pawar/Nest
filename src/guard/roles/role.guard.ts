import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    const roles = this.reflector.get('roles', context.getHandler());

    if (
      (isPublic && !roles) ||
      (context.switchToHttp().getRequest().path.includes('api/metrics') && context.switchToHttp().getRequest().method === 'GET')
    ) {
      return true;
    }

    if (!roles) {
      this.logger.warn('Missing roles for handler!');
      return false;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn('User not found in request');
      return false;
    }

    const userRoles = user['cognito:groups'] || user.roles;
    const hasStageGroup = userRoles.find((role: RoleEnum) => role === RoleEnum.R_N_D_Lightstage);

    if (hasStageGroup) {
      return true;
    }

    const hasAccess = userRoles.some((role: RoleEnum) => roles.includes(role));

    if (!hasAccess) {
      this.logger.warn('User does not have access to resource');
      this.logger.warn(JSON.stringify({ userRoles, roles }));
    }

    return hasAccess;
  }
}
