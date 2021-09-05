import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @ApiProperty({ example: '1', description: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Dream', description: 'name' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'user@mail.ru', description: 'email' })
  @Column()
  email: string;

  @ApiProperty({ example: 'asd5tre342', description: 'password' })
  @Column({})
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
