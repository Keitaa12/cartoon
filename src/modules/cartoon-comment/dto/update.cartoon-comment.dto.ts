import { PartialType } from "@nestjs/swagger";
import { CreateCartoonCommentDto } from "./create.cartoon-comment.dto";

export class UpdateCartoonCommentDto extends PartialType(
  CreateCartoonCommentDto,
) {}

