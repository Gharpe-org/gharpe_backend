import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('me')
  async getProfile() {
    return { message: 'Auth disabled - all endpoints are public' };
  }
}

