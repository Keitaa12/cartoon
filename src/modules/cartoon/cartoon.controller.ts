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
  ApiParam,
} from "@nestjs/swagger";
import { CartoonService } from "./cartoon.service";
import { CreateCartoonDto } from "./dto/create.cartoon.dto";
import { UpdateCartoonDto } from "./dto/update.cartoon.dto";
import { CartoonResponseDto } from "./dto/cartoon-response.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard, Roles } from "src/common/guards/roles.guard";
import { UserRoleEnum } from "src/common/enums/user-role.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";

@ApiTags("Cartoon")
@Controller("cartoon")
export class CartoonController {
  constructor(private readonly cartoonService: CartoonService) {}

  @Post("chain/:chainId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiBearerAuth()
  @ApiParam({
    name: "chainId",
    description: "ID de la chaîne",
    type: String,
  })
  @ApiOperation({
    summary: "Créer un dessin animé",
    description: "Permet à un CREATOR de créer un dessin animé pour sa chaîne",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Dessin animé créé avec succès",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Données invalides",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Vous n'êtes pas autorisé à créer ce dessin animé",
  })
  async create(
    @Param("chainId") chainId: string,
    @Body() dto: CreateCartoonDto,
    @Req() req: any,
  ) {
    const cartoon = await this.cartoonService.create(dto, chainId, req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Dessin animé créé avec succès",
      data: new CartoonResponseDto(cartoon),
    };
  }

  @Get()
  @ApiOperation({
    summary: "Lister tous les dessins animés",
    description: "Récupère tous les dessins animés (publique)",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Numéro de page (par défaut: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Nombre d'éléments par page (par défaut: 10)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des dessins animés récupérée avec succès",
  })
  async findAll(@Query() query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const result = await this.cartoonService.findAllPaginated(page, limit);
    return {
      statusCode: HttpStatus.OK,
      message: "Liste des dessins animés récupérée avec succès",
      data: result.data.map((cartoon) => new CartoonResponseDto(cartoon)),
      pagination: result.pagination,
    };
  }

  @Get("chain/:chainId")
  @ApiParam({
    name: "chainId",
    description: "ID de la chaîne",
    type: String,
  })
  @ApiOperation({
    summary: "Lister les dessins animés d'une chaîne",
    description: "Récupère tous les dessins animés d'une chaîne spécifique",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Numéro de page (par défaut: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Nombre d'éléments par page (par défaut: 10)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des dessins animés de la chaîne récupérée avec succès",
  })
  async findByChain(
    @Param("chainId") chainId: string,
    @Query() query: PaginationDto,
  ) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const result = await this.cartoonService.findByChainPaginated(
      chainId,
      page,
      limit,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Liste des dessins animés de la chaîne récupérée avec succès",
      data: result.data.map((cartoon) => new CartoonResponseDto(cartoon)),
      pagination: result.pagination,
    };
  }

  @Get(":id")
  @ApiParam({
    name: "id",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Récupérer un dessin animé",
    description: "Récupère les détails d'un dessin animé spécifique",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Dessin animé récupéré avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Dessin animé non trouvé",
  })
  async findOne(@Param("id") id: string) {
    const cartoon = await this.cartoonService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: "Dessin animé récupéré avec succès",
      data: new CartoonResponseDto(cartoon),
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Modifier un dessin animé",
    description: "Permet à un CREATOR de modifier un dessin animé de sa chaîne",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Dessin animé modifié avec succès",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Vous n'êtes pas autorisé à modifier ce dessin animé",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Dessin animé non trouvé",
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCartoonDto,
    @Req() req: any,
  ) {
    const cartoon = await this.cartoonService.update(id, dto, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: "Dessin animé modifié avec succès",
      data: new CartoonResponseDto(cartoon),
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR)
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Supprimer un dessin animé",
    description:
      "Permet à un CREATOR de supprimer un dessin animé de sa chaîne",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Dessin animé supprimé avec succès",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Vous n'êtes pas autorisé à supprimer ce dessin animé",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Dessin animé non trouvé",
  })
  async delete(@Param("id") id: string, @Req() req: any) {
    await this.cartoonService.delete(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: "Dessin animé supprimé avec succès",
    };
  }
}
