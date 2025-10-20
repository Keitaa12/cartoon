import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Query,
  Body,
  Req,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { ChainService } from "./chain.service";
import { CreateChainDto } from "./dto/create.chain.dto";
import { UpdateChainDto } from "./dto/update.chain.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard, Roles } from "src/common/guards/roles.guard";
import { UserRoleEnum } from "src/common/enums/user-role.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";

@ApiTags("Chain")
@Controller("chain")
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Créer une chaîne",
    description: "Permet à un CREATOR de créer une chaîne pour son entreprise",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Chaîne créée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Entreprise non associée ou inactive",
  })
  async create(@Body() dto: CreateChainDto, @Req() req: any) {
    const chain = await this.chainService.create(dto, req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Chaîne créée avec succès",
      data: chain,
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Modifier une chaîne",
    description: "Permet à un CREATOR de modifier une chaîne de son entreprise",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Chaîne modifiée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Vous n'êtes pas autorisé à modifier cette chaîne",
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateChainDto,
    @Req() req: any,
  ) {
    const chain = await this.chainService.update(id, dto, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: "Chaîne modifiée avec succès",
      data: chain,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Supprimer une chaîne",
    description:
      "Permet à un CREATOR de supprimer une chaîne de son entreprise",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Chaîne supprimée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Vous n'êtes pas autorisé à supprimer cette chaîne",
  })
  async delete(@Param("id") id: string, @Req() req: any) {
    await this.chainService.delete(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: "Chaîne supprimée avec succès",
    };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Obtenir toutes les chaînes",
    description: "Récupère la liste de toutes les chaînes de dessins animés",
  })
  async findAll() {
    return await this.chainService.findAll();
  }

  @ApiOperation({
    summary: "Obtenir toutes les chaînes avec pagination",
    description:
      "Récupère la liste des chaînes avec pagination. Utilisez les paramètres page et limit pour contrôler la pagination.",
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
    return await this.chainService.findAllPaginated(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get("my-chain")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Obtenir ma chaîne",
    description:
      "Récupère la chaîne de l'entreprise de l'utilisateur connecté (une entreprise = une chaîne)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Chaîne récupérée avec succès",
  })
  async findMyChain(@Req() req: any) {
    const chain = await this.chainService.findMyChain(req.user);

    if (!chain) {
      return {
        statusCode: HttpStatus.OK,
        message: "Votre entreprise n'a pas encore de chaîne",
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Chaîne récupérée avec succès",
      data: chain,
    };
  }

  @Get("company/:companyId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Obtenir la chaîne d'une entreprise",
    description:
      "Récupère la chaîne d'une entreprise spécifique (une entreprise = une chaîne)",
  })
  async findByCompany(@Param("companyId") companyId: string) {
    const chain = await this.chainService.findByCompany(companyId);

    if (!chain) {
      return {
        statusCode: HttpStatus.OK,
        message: "Cette entreprise n'a pas de chaîne",
        data: null,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: "Chaîne récupérée avec succès",
      data: chain,
    };
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Obtenir une chaîne par ID",
    description: "Récupère les informations d'une chaîne spécifique",
  })
  async findOne(@Param("id") id: string) {
    return await this.chainService.findOne(id);
  }
}
