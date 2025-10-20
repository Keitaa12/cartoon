import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { PasswordReset } from "src/common/database/entities/password-reset.entity";

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetModel: Repository<PasswordReset>,
  ) {}

  async generateOtp(): Promise<string> {
    // Generate a 6-digit OTP code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createPasswordReset(
    email: string,
    otp: string,
    userId: string,
  ): Promise<PasswordReset> {
    // Delete old OTP codes for this email
    await this.passwordResetModel.delete({ email });

    // Create new OTP code
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expires in 15 minutes

    const passwordResetData: any = {
      email,
      otp,
      expiresAt,
      isUsed: false,
      isExpired: false,
      userId,
    };

    return this.passwordResetModel.save(passwordResetData);
  }

  async verifyOtp(email: string, otp: string): Promise<PasswordReset> {
    const passwordReset = await this.passwordResetModel.findOne({
      where: {
        email,
        otp,
        isUsed: false,
        isExpired: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!passwordReset) {
      throw new BadRequestException("Code OTP invalide ou expiré");
    }

    return passwordReset;
  }

  async markOtpAsUsed(id: string): Promise<void> {
    await this.passwordResetModel.update(id, {
      isUsed: true,
    });
  }
}
