import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @ApiOperation({ summary: 'Registration (Creating a new user)' })
  @ApiResponse({ status: 201, type: Users })
  @Post('/registration')
  async create(@Body() userDto: CreateUserDto): Promise<any> {
    return await this.usersService.createUser(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'authorization' })
  @ApiOkResponse({ description: 'login' })
  @ApiBody({ type: AuthUserDto })
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) res): Promise<any> {
    const JWTtoken = await this.authService.login(req.user);
    res.cookie('JWTtoken', JWTtoken.access_token, { httpOnly: true });
    return this.authService.login(req.user);
  }
}
