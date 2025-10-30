import { IsNotEmpty, IsNumber, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCartoonRatingDto {
  @ApiProperty({
    example: 4.5,
    description: "Note du dessin animé (0 à 5)",
  })
  @IsNotEmpty({ message: "La note est obligatoire." })
  @IsNumber({}, { message: "La note doit être un nombre." })
  @Min(0, { message: "La note doit être supérieure ou égale à 0." })
  @Max(5, { message: "La note doit être inférieure ou égale à 5." })
  rating: number;
}
