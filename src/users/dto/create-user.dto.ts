import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({example:'Dream', description:'name', default:'Dream'})
    @IsNotEmpty()
    @IsString()
    readonly name: string;


    @ApiProperty({example:'user@mail.ru', description:'email', default:'user@mail.ru'})
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;


    @ApiProperty({example:'asd5tre342', description:'password', default:'asd5tre342'})
    @IsNotEmpty()
    @IsString()
    readonly password: string;

}