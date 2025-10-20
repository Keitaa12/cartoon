import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "admin@cartoon.com" })
  @IsEmail({}, { message: "Le email doit contenir une adresse email valide." })
  @IsNotEmpty({ message: "Le email est obligatoire." })
  email: string;
}
