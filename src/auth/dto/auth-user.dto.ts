import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, default: 'Dream',})
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type: String, default: 'asd5tre342',})
    password: string;
}