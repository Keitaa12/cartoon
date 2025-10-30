import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsUrl,
  IsOptional,
  IsUUID,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCartoonDto {
  @ApiProperty({
    example: "https://example.com/images/cartoon-background.jpg",
    description: "URL de l'image de fond",
  })
  @IsNotEmpty({ message: "L'URL de l'image de fond est obligatoire." })
  @IsString({ message: "L'URL de l'image de fond doit être une chaîne de caractères." })
  @IsUrl({}, { message: "L'URL de l'image de fond doit être une URL valide." })
  imageBackgroundUrl: string;

  @ApiProperty({
    example: "https://example.com/videos/cartoon-episode.mp4",
    description: "URL de la vidéo",
  })
  @IsNotEmpty({ message: "L'URL de la vidéo est obligatoire." })
  @IsString({ message: "L'URL de la vidéo doit être une chaîne de caractères." })
  @IsUrl({}, { message: "L'URL de la vidéo doit être une URL valide." })
  videoUrl: string;

  @ApiProperty({
    example: "Les Aventures de Toto",
    description: "Titre du dessin animé",
  })
  @IsNotEmpty({ message: "Le titre est obligatoire." })
  @IsString({ message: "Le titre doit être une chaîne de caractères." })
  @MinLength(2, { message: "Le titre doit contenir au moins 2 caractères." })
  @MaxLength(200, { message: "Le titre doit contenir au plus 200 caractères." })
  title: string;

  @ApiProperty({
    example: "Une aventure fascinante de notre héros dans un monde magique",
    description: "Description du dessin animé",
  })
  @IsNotEmpty({ message: "La description est obligatoire." })
  @IsString({ message: "La description doit être une chaîne de caractères." })
  @MinLength(10, {
    message: "La description doit contenir au moins 10 caractères.",
  })
  @MaxLength(1000, {
    message: "La description doit contenir au plus 1000 caractères.",
  })
  description: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID de la catégorie de dessin animé",
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: "L'ID de la catégorie doit être un UUID valide." })
  categoryCartoonId?: string;
}

