import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // ✅ Endpoint to verify Firebase token
  @Public()
  @Post('verifyToken')
  async verifyToken(@Body('token') token: string) {
    return this.authService.verifyToken(token);
  }

  // ✅ Example profile route
  @Get('me')
  async getProfile() {
    return { message: 'Auth disabled - all endpoints are public' };
  }
}
