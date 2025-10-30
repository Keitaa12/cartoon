import { ApiProperty } from "@nestjs/swagger";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { CategoryCartoonResponseDto } from "src/modules/category-cartoon/dto/category-cartoon-response.dto";

export class CartoonResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageBackgroundUrl: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  ratings: number;

  @ApiProperty()
  chainId: string;

  @ApiProperty({ required: false })
  categoryCartoonId?: string;

  @ApiProperty({ required: false, type: () => CategoryCartoonResponseDto })
  categoryCartoon?: CategoryCartoonResponseDto;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(cartoon: Cartoon) {
    this.id = cartoon.id;
    this.imageBackgroundUrl = cartoon.imageBackgroundUrl;
    this.videoUrl = cartoon.videoUrl;
    this.title = cartoon.title;
    this.description = cartoon.description;
    this.ratings = cartoon.ratings;
    this.chainId = cartoon.chain?.id;
    this.categoryCartoonId = cartoon.categoryCartoon?.id;
    this.categoryCartoon = cartoon.categoryCartoon
      ? new CategoryCartoonResponseDto(cartoon.categoryCartoon)
      : undefined;
    this.likesCount = cartoon.likes?.length || 0;
    this.createdAt = cartoon.createdAt;
    this.updatedAt = cartoon.updatedAt;
  }
}

