import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResendVerificationDto {
  @ApiProperty({
    description: "Adresse email pour renvoyer le code de vérification",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Adresse email invalide" })
  @IsNotEmpty({ message: "L'adresse email est requise" })
  email: string;
}
