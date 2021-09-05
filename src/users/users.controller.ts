import {
  // Body,
  Controller,
  Get,
  // Post,
  // UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { TypeormExceptionFilter } from 'src/typeorm-exception.filter';
// import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @ApiOperation({ summary: 'Registration (Creating a new user)' })
  // @ApiResponse({ status: 201, type: Users })
  // // @UseGuards(LocalAuthGuard)
  // @UseFilters(TypeormExceptionFilter)
  // @Post('/registration')
  // create(@Body() userDto: CreateUserDto): Promise<void> {
  //   return this.usersService.createUser(userDto);
  // }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Getting all users' })
  @ApiResponse({ status: 200, type: Users })
  @Get()
  getAll(): Promise<Users[]> {
    return this.usersService.getAllUsers();
  }
}
