import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
}
