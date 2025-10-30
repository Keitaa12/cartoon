import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { CartoonLikeService } from "./cartoon-like.service";
import { CartoonLikeResponseDto } from "./dto/cartoon-like-response.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("CartoonLike")
@Controller("cartoon-like")
export class CartoonLikeController {
  constructor(private readonly cartoonLikeService: CartoonLikeService) {}

  @Post("cartoon/:cartoonId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Liker ou déliker un dessin animé",
    description:
      "Permet à un utilisateur connecté de liker un dessin animé ou de supprimer son like",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Like ajouté ou supprimé avec succès",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Dessin animé non trouvé",
  })
  async toggle(@Param("cartoonId") cartoonId: string, @Req() req: any) {
    const result = await this.cartoonLikeService.toggle(cartoonId, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: result.liked
        ? "Dessin animé liké avec succès"
        : "Like supprimé avec succès",
      data: result,
    };
  }

  @Get("cartoon/:cartoonId/is-liked")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Vérifier si l'utilisateur a liké un dessin animé",
    description:
      "Vérifie si l'utilisateur connecté a liké le dessin animé spécifié",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Statut du like récupéré avec succès",
  })
  async isLiked(@Param("cartoonId") cartoonId: string, @Req() req: any) {
    const liked = await this.cartoonLikeService.isLiked(
      cartoonId,
      req.user.sub,
    );
    return {
      statusCode: HttpStatus.OK,
      message: "Statut du like récupéré avec succès",
      data: { liked },
    };
  }

  @Get("cartoon/:cartoonId/count")
  @ApiParam({
    name: "cartoonId",
    description: "ID du dessin animé",
    type: String,
  })
  @ApiOperation({
    summary: "Compter les likes d'un dessin animé",
    description: "Récupère le nombre total de likes pour un dessin animé",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Nombre de likes récupéré avec succès",
  })
  async countLikes(@Param("cartoonId") cartoonId: string) {
    const count = await this.cartoonLikeService.countByCartoon(cartoonId);
    return {
      statusCode: HttpStatus.OK,
      message: "Nombre de likes récupéré avec succès",
      data: { count },
    };
  }
}
