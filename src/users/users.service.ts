import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private users: Repository<Users>
  ) {}

  async createUser(userDto: CreateUserDto) {
    const x = this.users.create({
      ...userDto,
      password: await bcrypt.hash(userDto.password, 10),
    });

    // const { password, ...result } = x;
    return await this.users.save(x);
  }

  async getAllUsers() {
    return await this.users.find({ select: ['name', 'email', 'id'] });
  }

  async findOne(name: string): Promise<Users | undefined> {
    return this.users.findOne({ where: { name } });
  }
}
