import {
  Controller,
  Get,
  Post,
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
import { CartoonRatingService } from "./cartoon-rating.service";
import { CreateCartoonRatingDto } from "./dto/create.cartoon-rating.dto";
import { CartoonRatingResponseDto } from "./dto/cartoon-rating-response.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { PaginationDto } from "src/common/dto/pagination.dto";

@ApiTags("CartoonRating")
@Controller("cartoon-rating")
export class CartoonRatingController {
  constructor(private readonly cartoonRatingService: CartoonRatingService) {}

  @Post("cartoon/:cartoonId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Noter ou mettre à jour une note pour un dessin animé",
    description:
      "Permet à un utilisateur connecté de noter un dessin animé ou de mettre à jour sa note existante",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Note créée ou mise à jour avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Dessin animé non trouvé",
  })
  async create(
    @Param("cartoonId") cartoonId: string,
    @Body() dto: CreateCartoonRatingDto,
    @Req() req: any,
  ) {
    const rating = await this.cartoonRatingService.createOrUpdate(
      cartoonId,
      dto,
      req.user,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: "Note enregistrée avec succès",
      data: new CartoonRatingResponseDto(rating),
    };
  }

  @Get("cartoon/:cartoonId")
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Récupérer toutes les notes d'un dessin animé",
    description: "Récupère toutes les notes d'un dessin animé avec pagination",
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
    description: "Liste des notes récupérée avec succès",
  })
  async findByCartoon(
    @Param("cartoonId") cartoonId: string,
    @Query() query: PaginationDto,
  ) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const result = await this.cartoonRatingService.findByCartoonPaginated(
      cartoonId,
      page,
      limit,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Liste des notes récupérée avec succès",
      data: result.data.map((rating) => new CartoonRatingResponseDto(rating)),
      pagination: result.pagination,
    };
  }

  @Get("cartoon/:cartoonId/my-rating")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Récupérer la note de l'utilisateur connecté pour un dessin animé",
    description:
      "Récupère la note de l'utilisateur connecté pour un dessin animé spécifique",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Note de l'utilisateur récupérée avec succès",
  })
  async getMyRating(
    @Param("cartoonId") cartoonId: string,
    @Req() req: any,
  ) {
    const rating = await this.cartoonRatingService.findByUserAndCartoon(
      cartoonId,
      req.user.sub,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Note récupérée avec succès",
      data: rating ? new CartoonRatingResponseDto(rating) : null,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "id",
    description: "ID de la note",
    type: String,
  })
  @ApiOperation({
    summary: "Supprimer une note",
    description: "Permet à l'utilisateur de supprimer sa note",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Note supprimée avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Note non trouvée",
  })
  async delete(@Param("id") id: string, @Req() req: any) {
    await this.cartoonRatingService.delete(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: "Note supprimée avec succès",
    };
  }
}

