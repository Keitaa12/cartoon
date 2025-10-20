import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/common/database/entities/user.entity";
import * as bcrypt from "bcryptjs";
import { UpdateUserDto } from "./dto/update.user.dto";
import {
  PaginationHelper,
  PaginationResult,
} from "src/common/helpers/pagination.helper";
import { EmailService } from "src/common/services/email.service";
import { EmailVerificationService } from "src/modules/auth/services/email-verification.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async create(dto: CreateUserDto): Promise<{ user: User; message: string }> {
    const emailExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (emailExist) throw new NotFoundException("Email déjà existant");

    const hashPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password: hashPassword,
      is_verified: false, // User starts as unverified
    });

    const savedUser = await this.userRepository.save(user);

    // Generate verification code and send email
    const verificationCode =
      await this.emailVerificationService.generateVerificationCode();
    await this.emailVerificationService.createEmailVerification(
      dto.email,
      verificationCode,
      savedUser.id,
    );

    // Send verification email
    const emailSent = await this.emailService.sendEmailVerification(
      dto.email,
      verificationCode,
      `${dto.first_name} ${dto.last_name}`,
    );

    if (!emailSent) {
      // Log error but don't fail user creation
      console.error(`Failed to send verification email to ${dto.email}`);
    }

    return {
      user: savedUser,
      message:
        "Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.",
    };
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<{ status: true; message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");
    await this.userRepository.update(id, dto);

    return {
      status: true,
      message: "Données de l'utilisateur modifiées avec succès.",
    };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<User>> {
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [users, total] = await this.userRepository.findAndCount({
      ...paginationOptions,
    });

    return PaginationHelper.createPaginationResult(users, page, limit, total);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");
    return user;
  }

  async delete(id: string): Promise<{ status: true; message: string }> {
    await this.userRepository.delete(id);
    return {
      status: true,
      message: "Utilisateur supprimé avec succès.",
    };
  }

  async findBy(field: string, value: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { [field]: value } });
  }

  async updatePassword(
    id: string,
    password: string,
  ): Promise<{ status: true; message: string }> {
    await this.userRepository.update(id, { password });
    return {
      status: true,
      message: "Mot de passe modifié avec succès.",
    };
  }

  async verifyEmail(
    email: string,
    verificationCode: string,
  ): Promise<{ status: true; message: string }> {
    // Verify the code
    const emailVerification =
      await this.emailVerificationService.verifyEmailCode(
        email,
        verificationCode,
      );

    // Mark verification as used
    await this.emailVerificationService.markVerificationAsUsed(
      emailVerification.id,
    );

    // Update user as verified
    await this.userRepository.update({ email }, { is_verified: true });

    return {
      status: true,
      message: "Email vérifié avec succès. Votre compte est maintenant actif.",
    };
  }

  async resendVerificationCode(
    email: string,
  ): Promise<{ status: true; message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    if (user.is_verified) {
      throw new NotFoundException("Cet email est déjà vérifié");
    }

    // Generate new verification code
    const verificationCode =
      await this.emailVerificationService.generateVerificationCode();
    await this.emailVerificationService.createEmailVerification(
      email,
      verificationCode,
      user.id,
    );

    // Send verification email
    const emailSent = await this.emailService.sendEmailVerification(
      email,
      verificationCode,
      `${user.first_name} ${user.last_name}`,
    );

    if (!emailSent) {
      throw new Error("Erreur lors de l'envoi de l'email de vérification");
    }

    return {
      status: true,
      message: "Code de vérification renvoyé avec succès.",
    };
  }
}
