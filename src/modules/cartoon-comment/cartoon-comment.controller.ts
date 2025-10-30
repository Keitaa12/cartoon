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
import { CartoonCommentService } from "./cartoon-comment.service";
import { CreateCartoonCommentDto } from "./dto/create.cartoon-comment.dto";
import { UpdateCartoonCommentDto } from "./dto/update.cartoon-comment.dto";
import { CartoonCommentResponseDto } from "./dto/cartoon-comment-response.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PaginationDto } from "src/common/dto/pagination.dto";

@ApiTags("CartoonComment")
@Controller("cartoon-comment")
export class CartoonCommentController {
  constructor(private readonly cartoonCommentService: CartoonCommentService) {}

  @Post("cartoon/:cartoonId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Créer un commentaire sur un dessin animé",
    description:
      "Permet à un utilisateur connecté de commenter un dessin animé ou de répondre à un commentaire existant",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Commentaire créé avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Dessin animé ou commentaire parent non trouvé",
  })
  async create(
    @Param("cartoonId") cartoonId: string,
    @Body() dto: CreateCartoonCommentDto,
    @Req() req: any,
  ) {
    const comment = await this.cartoonCommentService.create(
      cartoonId,
      dto,
      req.user,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: "Commentaire créé avec succès",
      data: new CartoonCommentResponseDto(comment),
    };
  }

  @Get("cartoon/:cartoonId")
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Récupérer tous les commentaires d'un dessin animé",
    description:
      "Récupère tous les commentaires d'un dessin animé avec pagination",
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
    description: "Liste des commentaires récupérée avec succès",
  })
  async findByCartoon(
    @Param("cartoonId") cartoonId: string,
    @Query() query: PaginationDto,
  ) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const result = await this.cartoonCommentService.findByCartoonPaginated(
      cartoonId,
      page,
      limit,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Liste des commentaires récupérée avec succès",
      data: result.data.map(
        (comment) => new CartoonCommentResponseDto(comment),
      ),
      pagination: result.pagination,
    };
  }

  @Get("parent/:parentCommentId")
  @ApiParam({
    name: "parentCommentId",
    description: "ID du commentaire parent",
    type: String,
  })
  @ApiOperation({
    summary: "Récupérer les réponses à un commentaire",
    description: "Récupère toutes les réponses à un commentaire parent",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Réponses récupérées avec succès",
  })
  async findByParentComment(@Param("parentCommentId") parentCommentId: string) {
    const replies =
      await this.cartoonCommentService.findByParentComment(parentCommentId);
    return {
      statusCode: HttpStatus.OK,
      message: "Réponses récupérées avec succès",
      data: replies.map((reply) => new CartoonCommentResponseDto(reply)),
    };
  }

  @Get(":id")
  @ApiParam({
    name: "id",
    description: "ID du commentaire",
    type: String,
  })
  @ApiOperation({
    summary: "Récupérer un commentaire",
    description: "Récupère les détails d'un commentaire spécifique",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Commentaire récupéré avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Commentaire non trouvé",
  })
  async findOne(@Param("id") id: string) {
    const comment = await this.cartoonCommentService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: "Commentaire récupéré avec succès",
      data: new CartoonCommentResponseDto(comment),
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "ID du commentaire",
    type: String,
  })
  @ApiOperation({
    summary: "Modifier un commentaire",
    description: "Permet à l'utilisateur de modifier son commentaire",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Commentaire modifié avec succès",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Vous n'êtes pas autorisé à modifier ce commentaire",
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCartoonCommentDto,
    @Req() req: any,
  ) {
    const comment = await this.cartoonCommentService.update(id, dto, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: "Commentaire modifié avec succès",
      data: new CartoonCommentResponseDto(comment),
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "ID du commentaire",
    type: String,
  })
  @ApiOperation({
    summary: "Supprimer un commentaire",
    description: "Permet à l'utilisateur de supprimer son commentaire",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Commentaire supprimé avec succès",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Vous n'êtes pas autorisé à supprimer ce commentaire",
  })
  async delete(@Param("id") id: string, @Req() req: any) {
    await this.cartoonCommentService.delete(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: "Commentaire supprimé avec succès",
    };
  }
}
