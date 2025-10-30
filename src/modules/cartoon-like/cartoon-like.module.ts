import { Module } from "@nestjs/common";
import { CartoonLikeService } from "./cartoon-like.service";
import { CartoonLikeController } from "./cartoon-like.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartoonLike } from "src/common/database/entities/cartoon-like.entity";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { User } from "src/common/database/entities/user.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([CartoonLike, Cartoon, User]), CommonModule],
  providers: [CartoonLikeService],
  controllers: [CartoonLikeController],
  exports: [CartoonLikeService],
})
export class CartoonLikeModule {}

