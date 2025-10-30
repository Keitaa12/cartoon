import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartoonRating } from "src/common/database/entities/cartoon-rating.entity";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { User } from "src/common/database/entities/user.entity";
import { CreateCartoonRatingDto } from "./dto/create.cartoon-rating.dto";
import {
  PaginationHelper,
  PaginationResult,
} from "src/common/helpers/pagination.helper";

@Injectable()
export class CartoonRatingService {
  constructor(
    @InjectRepository(CartoonRating)
    private cartoonRatingRepository: Repository<CartoonRating>,
    @InjectRepository(Cartoon)
    private cartoonRepository: Repository<Cartoon>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Calculer et mettre à jour la moyenne des notes d'un cartoon
   */
  private async updateCartoonAverageRating(cartoonId: string): Promise<void> {
    const ratings = await this.cartoonRatingRepository.find({
      where: { cartoon: { id: cartoonId } },
    });

    if (ratings.length === 0) {
      // Si aucune note, définir la moyenne à 0
      await this.cartoonRepository.update({ id: cartoonId }, { ratings: 0 });
      return;
    }

    // Calculer la moyenne
    const sum = ratings.reduce((acc, r) => acc + Number(r.rating), 0);
    const average = sum / ratings.length;

    // Mettre à jour la moyenne du cartoon
    await this.cartoonRepository.update(
      { id: cartoonId },
      { ratings: average },
    );
  }

  /**
   * Créer ou mettre à jour une note pour un cartoon
   */
  async createOrUpdate(
    cartoonId: string,
    dto: CreateCartoonRatingDto,
    user: any,
  ): Promise<CartoonRating> {
    // Récupérer l'utilisateur complet
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    // Vérifier que le cartoon existe
    const cartoon = await this.cartoonRepository.findOne({
      where: { id: cartoonId },
    });

    if (!cartoon) {
      throw new NotFoundException("Dessin animé non trouvé");
    }

    // Vérifier si l'utilisateur a déjà noté ce cartoon
    const existingRating = await this.cartoonRatingRepository.findOne({
      where: {
        cartoon: { id: cartoonId },
        user: { id: user.sub },
      },
    });

    let rating: CartoonRating;

    if (existingRating) {
      // Mettre à jour la note existante
      existingRating.rating = dto.rating;
      existingRating.updated_by = fullUser;
      rating = await this.cartoonRatingRepository.save(existingRating);
    } else {
      // Créer une nouvelle note
      rating = this.cartoonRatingRepository.create({
        rating: dto.rating,
        cartoon: cartoon,
        user: fullUser,
        created_by: fullUser,
      });
      rating = await this.cartoonRatingRepository.save(rating);
    }

    // Mettre à jour la moyenne du cartoon
    await this.updateCartoonAverageRating(cartoonId);

    // Recharger la note avec ses relations
    const reloadedRating = await this.cartoonRatingRepository.findOne({
      where: { id: rating.id },
      relations: ["cartoon", "user"],
    });

    if (!reloadedRating) {
      throw new NotFoundException("Erreur lors du rechargement de la note");
    }

    return reloadedRating;
  }

  /**
   * Supprimer une note
   */
  async delete(ratingId: string, user: any): Promise<void> {
    // Récupérer l'utilisateur complet
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const rating = await this.cartoonRatingRepository.findOne({
      where: { id: ratingId },
      relations: ["cartoon", "user"],
    });

    if (!rating) {
      throw new NotFoundException("Note non trouvée");
    }

    // Vérifier que l'utilisateur est le propriétaire de la note
    if (rating.user.id !== user.sub) {
      throw new BadRequestException(
        "Vous n'êtes pas autorisé à supprimer cette note",
      );
    }

    const cartoonId = rating.cartoon.id;

    await this.cartoonRatingRepository.softDelete(ratingId);

    // Mettre à jour la moyenne du cartoon
    await this.updateCartoonAverageRating(cartoonId);
  }

  /**
   * Récupérer toutes les notes d'un cartoon
   */
  async findByCartoon(cartoonId: string): Promise<CartoonRating[]> {
    return await this.cartoonRatingRepository.find({
      where: { cartoon: { id: cartoonId } },
      relations: ["user", "cartoon"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Récupérer toutes les notes d'un cartoon avec pagination
   */
  async findByCartoonPaginated(
    cartoonId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<CartoonRating>> {
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [ratings, total] = await this.cartoonRatingRepository.findAndCount({
      where: { cartoon: { id: cartoonId } },
      ...paginationOptions,
      relations: ["user", "cartoon"],
      order: { createdAt: "DESC" },
    });

    return PaginationHelper.createPaginationResult(ratings, page, limit, total);
  }

  /**
   * Récupérer la note d'un utilisateur pour un cartoon
   */
  async findByUserAndCartoon(
    cartoonId: string,
    userId: string,
  ): Promise<CartoonRating | null> {
    return await this.cartoonRatingRepository.findOne({
      where: {
        cartoon: { id: cartoonId },
        user: { id: userId },
      },
      relations: ["cartoon", "user"],
    });
  }
}
