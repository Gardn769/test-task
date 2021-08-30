import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTransactionsDto {
   
    @ApiProperty({example:'10', description:'Count products', default:'10'})
    @IsNotEmpty()
    @IsNumber()
    readonly count: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({example:'20', description:'id_product', default:'20'})
    readonly id_product: number;
}