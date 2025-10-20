import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateRegistrationRequestDto {
  // Informations de l'entreprise
  @ApiProperty({ description: "Nom de l'entreprise" })
  @IsNotEmpty({ message: "Le nom de l'entreprise est requis" })
  @IsString()
  company_name: string;

  @ApiProperty({ description: "Description de l'entreprise", required: false })
  @IsOptional()
  @IsString()
  company_description?: string;

  @ApiProperty({ description: "Adresse de l'entreprise" })
  @IsNotEmpty({ message: "L'adresse de l'entreprise est requise" })
  @IsString()
  company_address: string;

  @ApiProperty({ description: "Ville de l'entreprise", required: false })
  @IsOptional()
  @IsString()
  company_city?: string;

  @ApiProperty({ description: "Pays de l'entreprise", required: false })
  @IsOptional()
  @IsString()
  company_country?: string;

  @ApiProperty({ description: "Code postal de l'entreprise", required: false })
  @IsOptional()
  @IsString()
  company_postal_code?: string;

  @ApiProperty({ description: "Email de l'entreprise" })
  @IsNotEmpty({ message: "L'email de l'entreprise est requis" })
  @IsEmail({}, { message: "Email invalide" })
  company_email: string;

  @ApiProperty({ description: "Téléphone de l'entreprise", required: false })
  @IsOptional()
  @IsString()
  company_phone?: string;

  @ApiProperty({ description: "Site web de l'entreprise", required: false })
  @IsOptional()
  @IsString()
  company_website?: string;

  // Mot de passe pour le compte utilisateur
  @ApiProperty({ description: "Mot de passe", minLength: 6 })
  @IsNotEmpty({ message: "Le mot de passe est requis" })
  @MinLength(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  })
  @IsString()
  password: string;
}
