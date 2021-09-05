import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Bread', description: 'name', default: 'Bread' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'food',
    description: 'description product',
    default: 'food',
  })
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Amazon',
    description: 'shop_name',
    default: 'Amazon',
  })
  readonly shop_name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Count products', default: '10' })
  readonly count: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '20', description: 'Cost products', default: '20' })
  readonly cost: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '10', description: 'purchase price', default: '10' })
  readonly purchase_price: number;
}
