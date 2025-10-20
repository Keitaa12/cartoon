import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { CompanyRegistrationRequest } from "src/common/database/entities/company-registration-request.entity";
import { Company } from "src/common/database/entities/company.entity";
import { User } from "src/common/database/entities/user.entity";
import { CreateRegistrationRequestDto } from "./dto/create-registration-request.dto";
import { ReviewRegistrationRequestDto } from "./dto/review-registration-request.dto";
import { UpdateRegistrationRequestDto } from "./dto/update-registration-request.dto";
import { CreateCompanyDirectlyDto } from "./dto/create-company-directly.dto";
import { RegistrationStatusEnum } from "src/common/enums/registration-status.enum";
import { UserRoleEnum } from "src/common/enums/user-role.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  PaginationHelper,
  PaginationResult,
} from "src/common/helpers/pagination.helper";

@Injectable()
export class CompanyRegistrationService {
  constructor(
    @InjectRepository(CompanyRegistrationRequest)
    private readonly registrationRequestRepository: Repository<CompanyRegistrationRequest>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Créer une nouvelle demande de création de compte entreprise
   */
  async createRegistrationRequest(
    createDto: CreateRegistrationRequestDto,
  ): Promise<CompanyRegistrationRequest> {
    // Vérifier si l'email de l'entreprise existe déjà
    const existingCompany = await this.companyRepository.findOne({
      where: { email: createDto.company_email },
    });

    if (existingCompany) {
      throw new ConflictException("Une entreprise avec cet email existe déjà");
    }

    // Vérifier si une demande en attente existe déjà
    const existingRequest = await this.registrationRequestRepository.findOne({
      where: {
        company_email: createDto.company_email,
        status: RegistrationStatusEnum.PENDING,
      },
    });

    if (existingRequest) {
      throw new ConflictException(
        "Une demande de création de compte est déjà en cours de traitement pour cet email",
      );
    }

    // Vérifier si l'email de l'entreprise existe déjà en tant qu'utilisateur
    const existingUser = await this.userRepository.findOne({
      where: { email: createDto.company_email },
    });

    if (existingUser) {
      throw new ConflictException("Un utilisateur avec cet email existe déjà");
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    // Créer la demande
    const request = this.registrationRequestRepository.create({
      company_name: createDto.company_name,
      company_description: createDto.company_description,
      company_address: createDto.company_address,
      company_city: createDto.company_city,
      company_country: createDto.company_country,
      company_postal_code: createDto.company_postal_code,
      company_email: createDto.company_email,
      company_phone: createDto.company_phone,
      company_website: createDto.company_website,
      password: hashedPassword,
      status: RegistrationStatusEnum.PENDING,
    });

    return await this.registrationRequestRepository.save(request);
  }

  /**
   * Créer directement une entreprise et son compte utilisateur (Admin uniquement)
   * Sans passer par le processus de demande
   */
  async createCompanyDirectly(
    createDto: CreateCompanyDirectlyDto,
    adminUser: User,
  ): Promise<{ company: Company; user: User }> {
    // Vérifier si l'email de l'entreprise existe déjà
    const existingCompany = await this.companyRepository.findOne({
      where: { email: createDto.company_email },
    });

    if (existingCompany) {
      throw new ConflictException("Une entreprise avec cet email existe déjà");
    }

    // Vérifier si l'email de l'entreprise existe déjà en tant qu'utilisateur
    const existingUser = await this.userRepository.findOne({
      where: { email: createDto.company_email },
    });

    if (existingUser) {
      throw new ConflictException("Un utilisateur avec cet email existe déjà");
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createDto.password, 10);

    // Créer l'entreprise
    const company = this.companyRepository.create({
      name: createDto.company_name,
      description: createDto.company_description,
      address: createDto.company_address,
      city: createDto.company_city,
      country: createDto.company_country,
      postal_code: createDto.company_postal_code,
      email: createDto.company_email,
      phone: createDto.company_phone,
      website: createDto.company_website,
      logo_url: createDto.company_logo_url,
      is_active: true,
      created_by: adminUser,
    });

    const savedCompany = await this.companyRepository.save(company);

    // Créer le compte utilisateur avec l'email de l'entreprise
    const user = this.userRepository.create({
      email: createDto.company_email,
      password: hashedPassword,
      first_name: createDto.company_name,
      last_name: "", // Pas de nom de famille pour les comptes entreprises
      role: UserRoleEnum.CREATOR,
      is_verified: true, // Vérifié automatiquement car créé par admin
      is_locked: false,
      company: savedCompany,
      created_by: adminUser,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      company: savedCompany,
      user: savedUser,
    };
  }

  /**
   * Récupérer toutes les demandes avec pagination
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<CompanyRegistrationRequest>> {
    const { page = 1, limit = 10 } = paginationDto;
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [requests, total] =
      await this.registrationRequestRepository.findAndCount({
        ...paginationOptions,
        relations: ["company", "created_user", "reviewed_by"],
        order: {
          createdAt: "DESC",
        },
      });

    return PaginationHelper.createPaginationResult(
      requests,
      page,
      limit,
      total,
    );
  }

  /**
   * Récupérer les demandes par statut
   */
  async findByStatus(
    status: RegistrationStatusEnum,
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<CompanyRegistrationRequest>> {
    const { page = 1, limit = 10 } = paginationDto;
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [requests, total] =
      await this.registrationRequestRepository.findAndCount({
        ...paginationOptions,
        where: { status },
        relations: ["company", "created_user", "reviewed_by"],
        order: {
          createdAt: "DESC",
        },
      });

    return PaginationHelper.createPaginationResult(
      requests,
      page,
      limit,
      total,
    );
  }

  /**
   * Récupérer une demande par ID
   */
  async findOne(id: string): Promise<CompanyRegistrationRequest> {
    const request = await this.registrationRequestRepository.findOne({
      where: { id },
      relations: ["company", "created_user", "reviewed_by"],
    });

    if (!request) {
      throw new NotFoundException("Demande non trouvée");
    }

    return request;
  }

  /**
   * Mettre à jour une demande (seulement si en attente)
   */
  async updateRequest(
    id: string,
    updateDto: UpdateRegistrationRequestDto,
  ): Promise<CompanyRegistrationRequest> {
    const request = await this.findOne(id);

    if (request.status !== RegistrationStatusEnum.PENDING) {
      throw new BadRequestException(
        "Impossible de modifier une demande déjà traitée",
      );
    }

    // Si le mot de passe est fourni, le hasher
    if (updateDto.password) {
      updateDto.password = await bcrypt.hash(updateDto.password, 10);
    }

    Object.assign(request, updateDto);
    return await this.registrationRequestRepository.save(request);
  }

  /**
   * Approuver ou rejeter une demande (par un admin)
   */
  async reviewRequest(
    id: string,
    reviewDto: ReviewRegistrationRequestDto,
    adminUser: User,
  ): Promise<CompanyRegistrationRequest> {
    const request = await this.findOne(id);

    if (request.status !== RegistrationStatusEnum.PENDING) {
      throw new BadRequestException("Cette demande a déjà été traitée");
    }

    if (reviewDto.status === RegistrationStatusEnum.PENDING) {
      throw new BadRequestException("Veuillez approuver ou rejeter la demande");
    }

    // Si la demande est approuvée, créer l'entreprise et le compte utilisateur
    if (reviewDto.status === RegistrationStatusEnum.APPROVED) {
      // Créer l'entreprise
      const company = this.companyRepository.create({
        name: request.company_name,
        description: request.company_description,
        address: request.company_address,
        city: request.company_city,
        country: request.company_country,
        postal_code: request.company_postal_code,
        email: request.company_email,
        phone: request.company_phone,
        website: request.company_website,
        is_active: true,
        created_by: adminUser,
      });

      const savedCompany = await this.companyRepository.save(company);

      // Créer le compte utilisateur avec l'email de l'entreprise
      const user = this.userRepository.create({
        email: request.company_email,
        password: request.password, // Déjà hashé
        first_name: request.company_name,
        last_name: "", // Pas de nom de famille pour les comptes entreprises
        role: UserRoleEnum.CREATOR,
        is_verified: true, // Vérifié automatiquement car approuvé par admin
        is_locked: false,
        company: savedCompany,
        created_by: adminUser,
      });

      const savedUser = await this.userRepository.save(user);

      // Mettre à jour la demande
      request.status = reviewDto.status;
      request.admin_notes = reviewDto.admin_notes || null;
      request.company = savedCompany;
      request.created_user = savedUser;
      request.reviewed_by = adminUser;
    } else if (reviewDto.status === RegistrationStatusEnum.REJECTED) {
      // Si rejeté, juste mettre à jour le statut et la raison
      request.status = reviewDto.status;
      request.rejection_reason = reviewDto.rejection_reason || null;
      request.admin_notes = reviewDto.admin_notes || null;
      request.reviewed_by = adminUser;
    }

    return await this.registrationRequestRepository.save(request);
  }

  /**
   * Supprimer une demande
   */
  async deleteRequest(id: string): Promise<void> {
    const request = await this.findOne(id);

    if (request.status === RegistrationStatusEnum.APPROVED) {
      throw new BadRequestException(
        "Impossible de supprimer une demande approuvée",
      );
    }

    await this.registrationRequestRepository.softDelete(id);
  }
}
