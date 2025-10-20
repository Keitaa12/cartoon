import { DEFAULT_JWT_EXPIRATION } from "src/common/constants/app.constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/database/entities/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/common/strategies/jwt.strategy";
import { UserModule } from "../user/user.module";
import { CommonModule } from "src/common/common.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_CONTENTS_SECRET || "iAmZombie",
      signOptions: { expiresIn: DEFAULT_JWT_EXPIRATION },
    }),
    UserModule,
    CommonModule,
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
