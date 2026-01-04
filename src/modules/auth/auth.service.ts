import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { User } from "src/common/database/entities/user.entity";
import * as bcrypt from "bcryptjs";
import { DEFAULT_JWT_EXPIRATION } from "src/common/constants/app.constants";
import { JwtService } from "@nestjs/jwt";
import { ForgotPasswordDto } from "./dto/forgot.password.dto";
import { OtpService } from "./services/otp.service";
import { EmailService } from "src/common/services/email.service";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) { }

  async login(dto: LoginDto) {
    const user = await this.validate(dto.email, dto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: DEFAULT_JWT_EXPIRATION,
        secret: process.env.JWT_CONTENTS_SECRET || "iAmZombie",
      }),
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }

  async validate(email: string, password: string): Promise<User> {
    const findUser = await this.userService.findBy("email", email);

    if (!findUser) throw new UnauthorizedException("Vous n'êtes pas autorisé");

    const user = findUser;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      throw new UnauthorizedException("Email ou mot de passe incorrect");

    if (user.is_locked)
      throw new UnauthorizedException(
        "Compte bloqué, veuillez connecter le super administrateur",
      );

    return user;
  }

  // Send OTP code by email
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
    statusCode: number;
    message: string;
  }> {
    const { email } = forgotPasswordDto;

    // Check if user exists and determine their type
    const userInfo = await this.userService.findBy("email", email);

    if (!userInfo) {
      throw new NotFoundException(
        "Aucun compte trouvé avec cette adresse email",
      );
    }

    const { id, first_name, last_name } = userInfo;

    // Generate OTP code
    const otp = await this.otpService.generateOtp();

    // Create password reset record
    await this.otpService.createPasswordReset(email, otp, id);

    // Send email
    const emailSent = await this.emailService.sendPasswordResetEmail(
      email,
      otp,
      first_name + " " + last_name,
    );

    if (!emailSent) {
      throw new NotFoundException("Erreur lors de l'envoi de l'email");
    }

    return {
      statusCode: 200,
      message: "Un code de réinitialisation a été envoyé à votre adresse email",
    };
  }

  // Verify OTP code
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
    statusCode: number;
    message: string;
    resetToken: string;
  }> {
    const { email, otp } = verifyOtpDto;

    // Verify OTP code
    const passwordReset = await this.otpService.verifyOtp(email, otp);

    // Mark OTP code as used
    await this.otpService.markOtpAsUsed(passwordReset.id);

    // Generate temporary token for password reset
    const resetToken = this.jwtService.sign(
      {
        email,
        resetId: passwordReset.id,
        type: "password_reset",
      },
      { expiresIn: "15m" },
    );

    return {
      statusCode: 200,
      message: "Code OTP vérifié avec succès",
      resetToken,
    };
  }

  // Reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
    statusCode: number;
    message: string;
  }> {
    const { email, newPassword, confirmPassword, resetToken } =
      resetPasswordDto;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException("Les mots de passe ne correspondent pas");
    }

    // Verify reset token
    let decodedToken: any;
    try {
      decodedToken = this.jwtService.verify(resetToken);
    } catch (error) {
      throw new BadRequestException(
        "Token de réinitialisation invalide ou expiré",
      );
    }

    if (
      decodedToken.type !== "password_reset" ||
      decodedToken.email !== email
    ) {
      throw new BadRequestException("Token de réinitialisation invalide");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password based on user type
    const userInfo = await this.userService.findBy("email", email);

    if (!userInfo) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    const { id } = userInfo;
    await this.userService.updatePassword(id, hashedPassword);

    return {
      statusCode: 200,
      message: "Mot de passe réinitialisé avec succès",
    };
  }
}
