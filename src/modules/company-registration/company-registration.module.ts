import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyRegistrationService } from "./company-registration.service";
import { CompanyRegistrationController } from "./company-registration.controller";
import { CompanyRegistrationRequest } from "src/common/database/entities/company-registration-request.entity";
import { Company } from "src/common/database/entities/company.entity";
import { User } from "src/common/database/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRegistrationRequest, Company, User]),
  ],
  controllers: [CompanyRegistrationController],
  providers: [CompanyRegistrationService],
  exports: [CompanyRegistrationService],
})
export class CompanyRegistrationModule {}
