import { Module } from "@nestjs/common";
import { CartoonRatingService } from "./cartoon-rating.service";
import { CartoonRatingController } from "./cartoon-rating.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartoonRating } from "src/common/database/entities/cartoon-rating.entity";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { User } from "src/common/database/entities/user.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CartoonRating, Cartoon, User]),
    CommonModule,
  ],
  providers: [CartoonRatingService],
  controllers: [CartoonRatingController],
  exports: [CartoonRatingService],
})
export class CartoonRatingModule {}

