import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateProductDto {

    @ApiProperty({example:'Bread', description:'name', default:'Bread'})
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({example:'food', description:'description product', default:'food'})
    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @ApiProperty({example:'Amazon', description:'shop_name', default:'Amazon'})
    @IsNotEmpty()
    @IsString()
    readonly shop_name: string;

    @ApiProperty({example:'50', description:'Count products', default:'10'})
    @IsNotEmpty()
    @IsNumber()
    readonly count: number;

    @ApiProperty({example:'20', description:'Cost products', default:'20'})
    @IsNotEmpty()
    @IsNumber()
    readonly cost: number;
}