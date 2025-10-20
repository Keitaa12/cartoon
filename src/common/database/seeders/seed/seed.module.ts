import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { User } from "src/common/database/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeedService],
  exports: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
