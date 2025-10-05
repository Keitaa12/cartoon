import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';

dotenv.config();

const EMAIL_FROM_ADDRESS: string =
  process.env.EMAIL_FROM_ADDRESS || 'noreply@cartoon.com';
const EMAIL_FROM_NAME: string = process.env.EMAIL_FROM_NAME || 'CARTOON';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailService: MailerService) {}

  async sendPasswordResetEmail(
    email: string,
    otp: string,
    userName: string,
  ): Promise<boolean> {
    try {
      await this.mailService.sendMail({
        from: {
          name: EMAIL_FROM_NAME,
          address: EMAIL_FROM_ADDRESS,
        },
        to: email,
        subject: 'Réinitialisation de mot de passe - CARTOON',
        template: 'password-reset',
        context: {
          userName,
          otp,
          currentYear: new Date().getFullYear(),
          resetUrl: `${
            process.env.FRONTEND_URL || 'https://app.cartoon.com'
          }/reset-password?token=${otp}`,
        },
      });

      this.logger.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending email to ${email}:`, error);

      // Log detailed error information for debugging
      if (error.code) {
        this.logger.error(`SMTP Error Code: ${error.code}`);
      }
      if (error.command) {
        this.logger.error(`SMTP Command: ${error.command}`);
      }
      if (error.response) {
        this.logger.error(`SMTP Response: ${error.response}`);
      }

      return false;
    }
  }

  async sendEmailVerification(
    email: string,
    verificationCode: string,
    userName: string,
  ): Promise<boolean> {
    try {
      await this.mailService.sendMail({
        from: {
          name: EMAIL_FROM_NAME,
          address: EMAIL_FROM_ADDRESS,
        },
        to: email,
        subject: 'Vérification de votre compte - CARTOON',
        template: 'email-verification',
        context: {
          userName,
          verificationCode,
          currentYear: new Date().getFullYear(),
        },
      });

      this.logger.log(`Email verification sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending verification email to ${email}:`, error);

      // Log detailed error information for debugging
      if (error.code) {
        this.logger.error(`SMTP Error Code: ${error.code}`);
      }
      if (error.command) {
        this.logger.error(`SMTP Command: ${error.command}`);
      }
      if (error.response) {
        this.logger.error(`SMTP Response: ${error.response}`);
      }

      return false;
    }
  }
}
