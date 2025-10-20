import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyOtpDto {
  @ApiProperty({ example: "admin@cartoon.com" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  @IsEmail({}, { message: "Veuillez entrer une adresse email valide" })
  readonly email: string;

  @IsNotEmpty({ message: "Le code OTP est obligatoire" })
  @ApiProperty({ example: "123456" })
  @IsString({ message: "Le code OTP doit être une chaîne de caractères" })
  @Length(6, 6, {
    message: "Le code OTP doit contenir exactement 6 caractères",
  })
  readonly otp: string;
}
