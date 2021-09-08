import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Products {
  @ApiProperty({ example: '1', description: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'bread', description: 'name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'food', description: 'description product' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: 'Amazon', description: 'shop_name' })
  @Column()
  shop_name: string;

  @ApiProperty({ example: '50', description: 'Count' })
  @Column({ nullable: true })
  count: number;

  @ApiProperty({ example: '20', description: 'cost' })
  @Column({ nullable: true })
  cost: number;

  @ApiProperty({ example: '10', description: 'purchase price' })
  @Column()
  purchase_price: number;

  @ApiProperty({ example: '15', description: 'id store owner' })
  @Column()
  owner: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
