import { IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCartoonCommentDto {
  @ApiProperty({
    example: "Super dessin animé ! J'ai beaucoup aimé l'histoire et les personnages.",
    description: "Contenu du commentaire",
  })
  @IsNotEmpty({ message: "Le contenu du commentaire est obligatoire." })
  @IsString({ message: "Le contenu doit être une chaîne de caractères." })
  @MinLength(3, {
    message: "Le contenu doit contenir au moins 3 caractères.",
  })
  @MaxLength(2000, {
    message: "Le contenu doit contenir au plus 2000 caractères.",
  })
  content: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID du commentaire parent (pour les réponses)",
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: "L'ID du commentaire parent doit être un UUID valide." })
  parentCommentId?: string;
}

