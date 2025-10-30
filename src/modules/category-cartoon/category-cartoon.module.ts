import { Module } from "@nestjs/common";
import { CategoryCartoonService } from "./category-cartoon.service";
import { CategoryCartoonController } from "./category-cartoon.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryCartoon } from "src/common/database/entities/category-cartoon.entity";
import { User } from "src/common/database/entities/user.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryCartoon, User]), CommonModule],
  providers: [CategoryCartoonService],
  controllers: [CategoryCartoonController],
  exports: [CategoryCartoonService],
})
export class CategoryCartoonModule {}

