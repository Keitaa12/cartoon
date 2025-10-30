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
import { CategoryCartoonService } from "./category-cartoon.service";
import { CreateCategoryCartoonDto } from "./dto/create.category-cartoon.dto";
import { UpdateCategoryCartoonDto } from "./dto/update.category-cartoon.dto";
import { CategoryCartoonResponseDto } from "./dto/category-cartoon-response.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard, Roles } from "src/common/guards/roles.guard";
import { UserRoleEnum } from "src/common/enums/user-role.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";

@ApiTags("CategoryCartoon")
@Controller("category-cartoon")
export class CategoryCartoonController {
  constructor(
    private readonly categoryCartoonService: CategoryCartoonService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR, UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Créer une catégorie de dessin animé",
    description:
      "Permet à un CREATOR ou ADMIN de créer une catégorie de dessin animé",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Catégorie créée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Données invalides",
  })
  async create(
    @Body() dto: CreateCategoryCartoonDto,
    @Req() req: any,
  ) {
    const category = await this.categoryCartoonService.create(dto, req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Catégorie créée avec succès",
      data: new CategoryCartoonResponseDto(category),
    };
  }

  @Get()
  @ApiOperation({
    summary: "Lister toutes les catégories",
    description: "Récupère toutes les catégories de dessins animés sans pagination (publique)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des catégories récupérée avec succès",
  })
  async findAll() {
    const categories = await this.categoryCartoonService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: "Liste des catégories récupérée avec succès",
      data: categories.map(
        (category) => new CategoryCartoonResponseDto(category),
      ),
    };
  }

  @Get("paginated")
  @ApiOperation({
    summary: "Lister toutes les catégories avec pagination",
    description:
      "Récupère la liste des catégories avec pagination. Utilisez les paramètres page et limit pour contrôler la pagination.",
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des catégories récupérée avec succès",
  })
  async findAllPaginated(@Query() paginationDto: PaginationDto) {
    const result = await this.categoryCartoonService.findAllPaginated(
      paginationDto.page,
      paginationDto.limit,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Liste des catégories récupérée avec succès",
      data: result.data.map(
        (category) => new CategoryCartoonResponseDto(category),
      ),
      pagination: result.pagination,
    };
  }

  @Get(":id")
  @ApiParam({
    name: "id",
    description: "ID de la catégorie",
    type: String,
  })
  @ApiOperation({
    summary: "Récupérer une catégorie",
    description: "Récupère les détails d'une catégorie spécifique",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Catégorie récupérée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Catégorie non trouvée",
  })
  async findOne(@Param("id") id: string) {
    const category = await this.categoryCartoonService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: "Catégorie récupérée avec succès",
      data: new CategoryCartoonResponseDto(category),
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR, UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "ID de la catégorie",
    type: String,
  })
  @ApiOperation({
    summary: "Modifier une catégorie",
    description:
      "Permet à un CREATOR ou ADMIN de modifier une catégorie de dessin animé",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Catégorie modifiée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Catégorie non trouvée",
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryCartoonDto,
    @Req() req: any,
  ) {
    const category = await this.categoryCartoonService.update(
      id,
      dto,
      req.user,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Catégorie modifiée avec succès",
      data: new CategoryCartoonResponseDto(category),
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.CREATOR, UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "ID de la catégorie",
    type: String,
  })
  @ApiOperation({
    summary: "Supprimer une catégorie",
    description:
      "Permet à un CREATOR ou ADMIN de supprimer une catégorie de dessin animé",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Catégorie supprimée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "Impossible de supprimer une catégorie qui contient des dessins animés",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Catégorie non trouvée",
  })
  async delete(@Param("id") id: string) {
    await this.categoryCartoonService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: "Catégorie supprimée avec succès",
    };
  }
}

