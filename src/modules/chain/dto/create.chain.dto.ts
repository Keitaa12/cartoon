import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChainDto {
  @ApiProperty({ example: "Cartoon Kids", description: "Nom de la chaîne" })
  @IsNotEmpty({ message: "Le nom est obligatoire." })
  @IsString({ message: "Le nom doit être une chaîne de caractères." })
  @MinLength(2, { message: "Le nom doit contenir au moins 2 caractères." })
  @MaxLength(100, { message: "Le nom doit contenir au plus 100 caractères." })
  name: string;

  @ApiProperty({
    example:
      "Chaîne dédiée aux dessins animés éducatifs et divertissants pour enfants",
    description: "Description de la chaîne",
  })
  @IsNotEmpty({ message: "La description est obligatoire." })
  @IsString({ message: "La description doit être une chaîne de caractères." })
  @MinLength(10, {
    message: "La description doit contenir au moins 10 caractères.",
  })
  @MaxLength(500, {
    message: "La description doit contenir au plus 500 caractères.",
  })
  description: string;

  @ApiProperty({
    example: "https://example.com/images/cartoon-kids-logo.png",
    description: "URL de l'image/logo de la chaîne",
  })
  @IsNotEmpty({ message: "L'URL de l'image est obligatoire." })
  @IsString({ message: "L'URL de l'image doit être une chaîne de caractères." })
  @IsUrl({}, { message: "L'URL de l'image doit être une URL valide." })
  imageUrl: string;
}
