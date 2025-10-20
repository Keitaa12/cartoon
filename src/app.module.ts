import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppService } from "./app.service";
import { getDatabaseConfig } from "./common/config/database.config";
import { User } from "./common/database/entities/user.entity";
import { PasswordReset } from "./common/database/entities/password-reset.entity";
import { EmailVerification } from "./common/database/entities/email-verification.entity";
import { Chain } from "./common/database/entities/chain.entity";
import { Company } from "./common/database/entities/company.entity";
import { CompanyRegistrationRequest } from "./common/database/entities/company-registration-request.entity";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ChainModule } from "./modules/chain/chain.module";
import { CompanyRegistrationModule } from "./modules/company-registration/company-registration.module";
import { SeedModule } from "./common/database/seeders/seed/seed.module";
import { CommonModule } from "./common/common.module";
import path from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: `"${process.env.EMAIL_FROM_NAME || "PEPCI"}" <${
            process.env.EMAIL_FROM_ADDRESS || "noreply@pepci.com"
          }>`,
        },
        template: {
          dir: path.join(__dirname, "common/templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      PasswordReset,
      EmailVerification,
      Chain,
      Company,
      CompanyRegistrationRequest,
    ]),
    CommonModule,
    UserModule,
    AuthModule,
    ChainModule,
    CompanyRegistrationModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
