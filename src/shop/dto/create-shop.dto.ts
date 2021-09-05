import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShopDto {
  @ApiProperty({
    example: 'Amazon',
    description: 'shop_name',
    default: 'Amazon',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'trades items',
    description: 'description shop',
    default: 'food',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({ example: '0', description: 'revenue', default: '0' })
  @IsNotEmpty()
  @IsNumber()
  readonly revenue: number;
}
