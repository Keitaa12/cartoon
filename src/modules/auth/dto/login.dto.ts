import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: "admin@gmail.com" })
  @IsEmail(
    {},
    {
      message: "Le email doit contenir une adresse email valide.",
    },
  )
  @IsNotEmpty({ message: "Le email est obligatoire." })
  email: string;

  @ApiProperty({ example: "@dmin123" })
  @IsString({
    message: "Le mot de passe doit être une chaîne de caractères.",
  })
  @IsNotEmpty({ message: "Le mot de passe est obligatoire." })
  password: string;
}
