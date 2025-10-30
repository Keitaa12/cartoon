import { ApiProperty } from "@nestjs/swagger";
import { CartoonRating } from "src/common/database/entities/cartoon-rating.entity";

export class CartoonRatingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  cartoonId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(cartoonRating: CartoonRating) {
    this.id = cartoonRating.id;
    this.rating = cartoonRating.rating;
    this.cartoonId = cartoonRating.cartoon?.id;
    this.userId = cartoonRating.user?.id;
    this.createdAt = cartoonRating.createdAt;
    this.updatedAt = cartoonRating.updatedAt;
  }
}

