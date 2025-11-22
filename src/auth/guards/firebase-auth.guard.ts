

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
// import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const url = request.url.split('?')[0];

        const publicRoutes = [
            '/auth/verifyToken',
            '/auth/google',
            '/auth/google/callback',
            '/auth/apple',
            '/auth/apple/callback',
            '/auth/facebook',
            '/auth/facebook/callback',
        ];

        if (publicRoutes.includes(url)) {
            return true;
        }

        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        const token = authHeader.split(' ')[1];
        const result = await this.authService.verifyToken(token);

        if (!result.success) {
            throw new UnauthorizedException('Invalid or expired Firebase token');
        }

        request.user = result.user;
        return true;
    }
}

