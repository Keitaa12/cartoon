import { PartialType } from "@nestjs/swagger";
import { CreateCategoryCartoonDto } from "./create.category-cartoon.dto";

export class UpdateCategoryCartoonDto extends PartialType(
  CreateCategoryCartoonDto,
) {}
