import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto { 
  @ApiProperty({ example: 'admin@cartoon.com' })
  @IsNotEmpty({ message: 'Le email est obligatoire.' })
  @IsEmail({}, { message: 'Le email doit contenir une adresse email valide.' })
  readonly email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire.' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  readonly newPassword: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'La confirmation du mot de passe est obligatoire.' })
  @IsString({ message: 'La confirmation du mot de passe doit être une chaîne de caractères.' })
  @MinLength(6, {
    message: 'La confirmation du mot de passe doit contenir au moins 6 caractères.',
  })
  readonly confirmPassword: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Le token de réinitialisation est obligatoire.' })
  @IsString({ message: 'Le token de réinitialisation doit être une chaîne de caractères.' })
  readonly resetToken: string;
}
