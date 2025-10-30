import { Module } from "@nestjs/common";
import { CartoonCommentService } from "./cartoon-comment.service";
import { CartoonCommentController } from "./cartoon-comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartoonComment } from "src/common/database/entities/cartoon-comment.entity";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { User } from "src/common/database/entities/user.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CartoonComment, Cartoon, User]),
    CommonModule,
  ],
  providers: [CartoonCommentService],
  controllers: [CartoonCommentController],
  exports: [CartoonCommentService],
})
export class CartoonCommentModule {}
