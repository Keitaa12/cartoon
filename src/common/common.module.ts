import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailService } from "./services/email.service";
import { OtpService } from "src/modules/auth/services/otp.service";
import { EmailVerificationService } from "src/modules/auth/services/email-verification.service";
import { PasswordReset } from "./database/entities/password-reset.entity";
import { EmailVerification } from "./database/entities/email-verification.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset, EmailVerification])],
  providers: [EmailService, OtpService, EmailVerificationService],
  exports: [EmailService, OtpService, EmailVerificationService],
})
export class CommonModule {}
