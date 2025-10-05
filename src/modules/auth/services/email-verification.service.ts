import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { EmailVerification } from 'src/common/database/entities/email-verification.entity';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
  ) {}

  async generateVerificationCode(): Promise<string> {
    // Generate a 6-digit verification code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createEmailVerification(
    email: string,
    verificationCode: string,
    userId: string,
  ): Promise<EmailVerification> {
    // Delete old verification codes for this email
    await this.emailVerificationRepository.delete({ email });

    // Create new verification code
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expires in 15 minutes

    const emailVerificationData = {
      email,
      verificationCode,
      expiresAt,
      isUsed: false,
      isExpired: false,
      userId,
    };

    return this.emailVerificationRepository.save(emailVerificationData);
  }

  async verifyEmailCode(email: string, verificationCode: string): Promise<EmailVerification> {
    const emailVerification = await this.emailVerificationRepository.findOne({
      where: {
        email,
        verificationCode,
        isUsed: false,
        isExpired: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!emailVerification) {
      throw new BadRequestException('Code de vérification invalide ou expiré');
    }

    return emailVerification;
  }

  async markVerificationAsUsed(id: string): Promise<void> {
    await this.emailVerificationRepository.update(id, {
      isUsed: true,
    });
  }

  async getVerificationByEmail(email: string): Promise<EmailVerification | null> {
    return this.emailVerificationRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });
  }
}
