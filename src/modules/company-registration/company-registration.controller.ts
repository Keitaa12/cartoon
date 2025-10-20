import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CompanyRegistrationService } from "./company-registration.service";
import { CreateRegistrationRequestDto } from "./dto/create-registration-request.dto";
import { ReviewRegistrationRequestDto } from "./dto/review-registration-request.dto";
import { UpdateRegistrationRequestDto } from "./dto/update-registration-request.dto";
import { CreateCompanyDirectlyDto } from "./dto/create-company-directly.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard, Roles } from "src/common/guards/roles.guard";
import { UserRoleEnum } from "src/common/enums/user-role.enum";
import { RegistrationStatusEnum } from "src/common/enums/registration-status.enum";

@ApiTags("Company Registration")
@Controller("company-registration")
export class CompanyRegistrationController {
  constructor(
    private readonly companyRegistrationService: CompanyRegistrationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Créer une demande de création de compte entreprise",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Demande créée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Email déjà utilisé ou demande en cours",
  })
  async createRegistrationRequest(
    @Body() createDto: CreateRegistrationRequestDto,
  ) {
    const request =
      await this.companyRegistrationService.createRegistrationRequest(
        createDto,
      );
    return {
      statusCode: HttpStatus.CREATED,
      message:
        "Demande de création de compte soumise avec succès. Vous serez notifié une fois la demande traitée.",
      data: request,
    };
  }

  @Post("direct")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Créer directement une entreprise et son compte utilisateur (Admin uniquement)",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Entreprise et compte utilisateur créés avec succès",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Email déjà utilisé",
  })
  async createCompanyDirectly(
    @Body() createDto: CreateCompanyDirectlyDto,
    @Req() req: any,
  ) {
    const result = await this.companyRegistrationService.createCompanyDirectly(
      createDto,
      req.user,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: "Entreprise et compte utilisateur créés avec succès",
      data: result,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Récupérer toutes les demandes (Admin uniquement)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des demandes récupérée avec succès",
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.companyRegistrationService.findAll(paginationDto);
    return {
      statusCode: HttpStatus.OK,
      message: "Liste des demandes récupérée avec succès",
      ...result,
    };
  }

  @Get("status/:status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Récupérer les demandes par statut (Admin uniquement)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des demandes filtrée par statut",
  })
  async findByStatus(
    @Param("status") status: RegistrationStatusEnum,
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await this.companyRegistrationService.findByStatus(
      status,
      paginationDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Liste des demandes ${status} récupérée avec succès`,
      ...result,
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Récupérer une demande par ID (Admin uniquement)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Demande récupérée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Demande non trouvée",
  })
  async findOne(@Param("id") id: string) {
    const request = await this.companyRegistrationService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: "Demande récupérée avec succès",
      data: request,
    };
  }

  @Patch(":id")
  @ApiOperation({ summary: "Mettre à jour une demande en attente" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Demande mise à jour avec succès",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Impossible de modifier une demande déjà traitée",
  })
  async updateRequest(
    @Param("id") id: string,
    @Body() updateDto: UpdateRegistrationRequestDto,
  ) {
    const request = await this.companyRegistrationService.updateRequest(
      id,
      updateDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Demande mise à jour avec succès",
      data: request,
    };
  }

  @Post(":id/review")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Approuver ou rejeter une demande (Admin uniquement)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Demande traitée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Demande déjà traitée",
  })
  async reviewRequest(
    @Param("id") id: string,
    @Body() reviewDto: ReviewRegistrationRequestDto,
    @Req() req: any,
  ) {
    const request = await this.companyRegistrationService.reviewRequest(
      id,
      reviewDto,
      req.user,
    );

    const message =
      reviewDto.status === RegistrationStatusEnum.APPROVED
        ? "Demande approuvée avec succès. L'entreprise et le compte utilisateur ont été créés."
        : "Demande rejetée avec succès.";

    return {
      statusCode: HttpStatus.OK,
      message,
      data: request,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Supprimer une demande (Admin uniquement)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Demande supprimée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Impossible de supprimer une demande approuvée",
  })
  async deleteRequest(@Param("id") id: string) {
    await this.companyRegistrationService.deleteRequest(id);
    return {
      statusCode: HttpStatus.OK,
      message: "Demande supprimée avec succès",
    };
  }
}
