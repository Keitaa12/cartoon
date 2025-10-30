import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryCartoonDto {
  @ApiProperty({
    example: "Aventure",
    description: "Nom de la catégorie",
  })
  @IsNotEmpty({ message: "Le nom est obligatoire." })
  @IsString({ message: "Le nom doit être une chaîne de caractères." })
  @MinLength(2, { message: "Le nom doit contenir au moins 2 caractères." })
  @MaxLength(100, { message: "Le nom doit contenir au plus 100 caractères." })
  name: string;

  @ApiProperty({
    example: "Dessins animés d'aventure et d'exploration",
    description: "Description de la catégorie",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "La description doit être une chaîne de caractères." })
  @MaxLength(500, {
    message: "La description doit contenir au plus 500 caractères.",
  })
  description?: string;

  @ApiProperty({
    example: "#FF5733",
    description: "Couleur de la catégorie (format hexadécimal)",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "La couleur doit être une chaîne de caractères." })
  @MaxLength(50, {
    message: "La couleur doit contenir au plus 50 caractères.",
  })
  color?: string;
}
