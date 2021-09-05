import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateTransactionsDto {
  @ApiProperty({ example: 'true', description: 'permission' })
  @IsNotEmpty()
  @IsBoolean()
  readonly permission: boolean;
}
