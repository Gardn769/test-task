import { Controller, Request, Post, UseGuards, Get, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiCookieAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { AuthUserDto } from './auth/dto/auth-user.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';


@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @ApiOperation({summary: 'authorization'})
  @ApiOkResponse({description: 'login'})
  @ApiBody({type: AuthUserDto})
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    
    let JWTtoken = await this.authService.login(req.user);
    res.cookie('JWTtoken', JWTtoken.access_token, {httpOnly: true});
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  
}