import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Get('profile')
  getProfile(@Request() req): Promise<any> {
    return req.user;
  }
}
