import { Module } from "@nestjs/common";
import { CartoonService } from "./cartoon.service";
import { CartoonController } from "./cartoon.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { CartoonRating } from "src/common/database/entities/cartoon-rating.entity";
import { CategoryCartoon } from "src/common/database/entities/category-cartoon.entity";
import { Chain } from "src/common/database/entities/chain.entity";
import { User } from "src/common/database/entities/user.entity";
import { Company } from "src/common/database/entities/company.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cartoon,
      CartoonRating,
      CategoryCartoon,
      Chain,
      User,
      Company,
    ]),
    CommonModule,
  ],
  providers: [CartoonService],
  controllers: [CartoonController],
  exports: [CartoonService],
})
export class CartoonModule {}
