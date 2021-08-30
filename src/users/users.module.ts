import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { Users } from './users.entity';
import { UsersService } from './users.service';

@Module({
    providers: [UsersService],
    exports: [UsersService],
    imports:[
        TypeOrmModule.forFeature([Users]),      
    ]
})
export class UsersModule {}
