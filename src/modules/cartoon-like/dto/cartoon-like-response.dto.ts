import { ApiProperty } from "@nestjs/swagger";
import { CartoonLike } from "src/common/database/entities/cartoon-like.entity";

export class CartoonLikeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  cartoonId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  constructor(cartoonLike: CartoonLike) {
    this.id = cartoonLike.id;
    this.cartoonId = cartoonLike.cartoon?.id;
    this.userId = cartoonLike.user?.id;
    this.createdAt = cartoonLike.createdAt;
  }
}

