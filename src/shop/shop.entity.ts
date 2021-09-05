import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Shops {
  @ApiProperty({ example: '1', description: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Amazon', description: 'shop_name' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: 'trades items', description: 'description shop' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: '15', description: 'id store owner' })
  @Column({ nullable: true })
  owner: number;

  @ApiProperty({ example: '+20', description: 'revenue' })
  @Column({ nullable: true })
  revenue: number;

  @CreateDateColumn()
  createAt: Date;
}
