import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CartoonLike } from "src/common/database/entities/cartoon-like.entity";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { User } from "src/common/database/entities/user.entity";

@Injectable()
export class CartoonLikeService {
  constructor(
    @InjectRepository(CartoonLike)
    private cartoonLikeRepository: Repository<CartoonLike>,
    @InjectRepository(Cartoon)
    private cartoonRepository: Repository<Cartoon>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Toggle like/unlike (si déjà liké, supprime le like)
   */
  async toggle(cartoonId: string, user: any): Promise<{ liked: boolean }> {
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

    // Vérifier si l'utilisateur a déjà liké ce cartoon
    const existingLike = await this.cartoonLikeRepository.findOne({
      where: {
        cartoon: { id: cartoonId },
        user: { id: user.sub },
      },
    });

    if (existingLike) {
      // L'utilisateur a déjà liké, on supprime le like (unlike)
      await this.cartoonLikeRepository.softDelete(existingLike.id);
      return { liked: false };
    } else {
      // L'utilisateur n'a pas liké, on ajoute le like
      const like = this.cartoonLikeRepository.create({
        cartoon: cartoon,
        user: fullUser,
        created_by: fullUser,
      });
      await this.cartoonLikeRepository.save(like);
      return { liked: true };
    }
  }

  /**
   * Vérifier si l'utilisateur a liké un cartoon
   */
  async isLiked(cartoonId: string, userId: string): Promise<boolean> {
    const like = await this.cartoonLikeRepository.findOne({
      where: {
        cartoon: { id: cartoonId },
        user: { id: userId },
      },
    });
    return !!like;
  }

  /**
   * Récupérer tous les likes d'un cartoon
   */
  async findByCartoon(cartoonId: string): Promise<CartoonLike[]> {
    return await this.cartoonLikeRepository.find({
      where: { cartoon: { id: cartoonId } },
      relations: ["cartoon", "user"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Compter le nombre de likes d'un cartoon
   */
  async countByCartoon(cartoonId: string): Promise<number> {
    return await this.cartoonLikeRepository.count({
      where: { cartoon: { id: cartoonId } },
    });
  }
}

