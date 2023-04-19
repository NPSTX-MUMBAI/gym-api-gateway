import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_ROLE } from '../dtos/signup.dto';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        
        const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();


        return requiredRoles.some((role) => {
            console.log('user', user);
            console.log('recieved role=>', role, 'context role=>', user?.roles?.map((r) => r));
            user?.roles?.includes(role);

        });
    }
}