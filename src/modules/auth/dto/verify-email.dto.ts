import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Adresse email à vérifier',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: 'L\'adresse email est requise' })
  email: string;

  @ApiProperty({
    description: 'Code de vérification à 6 chiffres',
    example: '123456',
    minLength: 6,
    maxLength: 6
  })
  @IsString({ message: 'Le code de vérification doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le code de vérification est requis' })
  @Length(6, 6, { message: 'Le code de vérification doit contenir exactement 6 chiffres' })
  verificationCode: string;
}
