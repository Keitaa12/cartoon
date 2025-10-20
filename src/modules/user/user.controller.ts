import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create.user.dto";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update.user.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { VerifyEmailDto } from "../auth/dto/verify-email.dto";
import { ResendVerificationDto } from "../auth/dto/resend-verification.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Ajouter un utilisateur" })
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @ApiOperation({ summary: "Modifier un utilisateur" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return await this.userService.update(id, dto);
  }

  @ApiOperation({ summary: "Obtenir tous les utilisateurs" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @ApiOperation({
    summary: "Obtenir tous les utilisateurs avec pagination",
    description:
      "Récupère la liste des utilisateurs avec pagination. Utilisez les paramètres page et limit pour contrôler la pagination.",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Numéro de page (commence à 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Nombre d'éléments par page (max 100)",
    example: 10,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("paginated")
  async findAllPaginated(@Query() paginationDto: PaginationDto) {
    return await this.userService.findAllPaginated(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @ApiOperation({ summary: "Obtenir un utilisateur" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.userService.findOne(id);
  }

  @ApiOperation({ summary: "Supprimer un utilisateur" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return await this.userService.delete(id);
  }

  @ApiOperation({
    summary: "Vérifier l'email avec un code de vérification",
    description:
      "Vérifie l'email de l'utilisateur en utilisant le code de vérification reçu par email",
  })
  @Post("verify-email")
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return await this.userService.verifyEmail(dto.email, dto.verificationCode);
  }

  @ApiOperation({
    summary: "Renvoyer le code de vérification",
    description:
      "Renvoye un nouveau code de vérification à l'adresse email spécifiée",
  })
  @Post("resend-verification")
  async resendVerificationCode(@Body() dto: ResendVerificationDto) {
    return await this.userService.resendVerificationCode(dto.email);
  }
}
