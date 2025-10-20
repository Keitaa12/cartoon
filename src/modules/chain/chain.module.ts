import { Module } from "@nestjs/common";
import { ChainService } from "./chain.service";
import { ChainController } from "./chain.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chain } from "src/common/database/entities/chain.entity";
import { Company } from "src/common/database/entities/company.entity";
import { User } from "src/common/database/entities/user.entity";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([Chain, Company, User]), CommonModule],
  providers: [ChainService],
  controllers: [ChainController],
  exports: [ChainService],
})
export class ChainModule {}
