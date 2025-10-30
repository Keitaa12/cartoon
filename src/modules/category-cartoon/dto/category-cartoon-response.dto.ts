import { ApiProperty } from "@nestjs/swagger";
import { CategoryCartoon } from "src/common/database/entities/category-cartoon.entity";

export class CategoryCartoonResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(categoryCartoon: CategoryCartoon) {
    this.id = categoryCartoon.id;
    this.name = categoryCartoon.name;
    this.description = categoryCartoon.description;
    this.color = categoryCartoon.color;
    this.createdAt = categoryCartoon.createdAt;
    this.updatedAt = categoryCartoon.updatedAt;
  }
}

