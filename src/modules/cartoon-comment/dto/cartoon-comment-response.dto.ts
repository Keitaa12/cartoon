import { ApiProperty } from "@nestjs/swagger";
import { CartoonComment } from "src/common/database/entities/cartoon-comment.entity";

export class CartoonCommentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  cartoonId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };

  @ApiProperty({ required: false })
  parentCommentId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(cartoonComment: CartoonComment) {
    this.id = cartoonComment.id;
    this.content = cartoonComment.content;
    this.cartoonId = cartoonComment.cartoon?.id;
    this.userId = cartoonComment.user?.id;
    this.parentCommentId = cartoonComment.parentComment?.id;
    this.createdAt = cartoonComment.createdAt;
    this.updatedAt = cartoonComment.updatedAt;

    // Inclure les infos de l'utilisateur si disponibles
    if (cartoonComment.user) {
      this.user = {
        id: cartoonComment.user.id,
        email: cartoonComment.user.email,
        firstName: cartoonComment.user.first_name,
        lastName: cartoonComment.user.last_name,
      };
    }
  }
}

