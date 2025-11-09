import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { CategoryCartoon } from "src/common/database/entities/category-cartoon.entity";
import { Chain } from "src/common/database/entities/chain.entity";
import { User } from "src/common/database/entities/user.entity";
import { CreateCartoonDto } from "./dto/create.cartoon.dto";
import { UpdateCartoonDto } from "./dto/update.cartoon.dto";
import {
  PaginationHelper,
  PaginationResult,
} from "src/common/helpers/pagination.helper";

@Injectable()
export class CartoonService {
  constructor(
    @InjectRepository(Cartoon)
    private cartoonRepository: Repository<Cartoon>,
    @InjectRepository(CategoryCartoon)
    private categoryCartoonRepository: Repository<CategoryCartoon>,
    @InjectRepository(Chain)
    private chainRepository: Repository<Chain>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Créer un dessin animé pour une chaîne de l'entreprise de l'utilisateur connecté
   */
  async create(
    dto: CreateCartoonDto,
    chainId: string,
    user: any,
  ): Promise<Cartoon> {
    // Récupérer l'utilisateur complet avec sa relation company
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ["company"],
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    /* if (!fullUser.company) {
      throw new BadRequestException(
        "Vous devez être associé à une entreprise pour créer un dessin animé",
      );
    } */

    // Vérifier que la chaîne existe et appartient à l'entreprise de l'utilisateur
    const chain = await this.chainRepository.findOne({
      where: { id: chainId },
      relations: ["company"],
    });

    if (!chain) {
      throw new NotFoundException("Chaîne non trouvée");
    }

    /* if (chain.company.id !== fullUser.company.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à créer un dessin animé pour cette chaîne",
      );
    } */

    // Récupérer la catégorie si elle est fournie
    let categoryCartoon: CategoryCartoon | null = null;
    if (dto.categoryCartoonId) {
      categoryCartoon = await this.categoryCartoonRepository.findOne({
        where: { id: dto.categoryCartoonId },
      });

      if (!categoryCartoon) {
        throw new NotFoundException("Catégorie de dessin animé non trouvée");
      }
    }

    // Supprimer categoryCartoonId du DTO pour éviter les erreurs
    const { categoryCartoonId, ...cartoonData } = dto;

    const cartoon = this.cartoonRepository.create({
      ...cartoonData,
      ratings: 0, // Toujours initialiser les ratings à 0 lors de la création
      chain: chain,
      categoryCartoon: categoryCartoon || undefined,
      created_by: fullUser,
    });

    const savedCartoon = await this.cartoonRepository.save(cartoon);

    // Recharger le dessin animé avec toutes ses relations
    const reloadedCartoon = await this.cartoonRepository.findOne({
      where: { id: savedCartoon.id },
      relations: ["chain", "chain.company", "categoryCartoon", "likes"],
    });

    if (!reloadedCartoon) {
      throw new NotFoundException(
        "Erreur lors du rechargement du dessin animé",
      );
    }

    return reloadedCartoon;
  }

  /**
   * Mettre à jour un dessin animé
   */
  async update(id: string, dto: UpdateCartoonDto, user: any): Promise<Cartoon> {
    // Récupérer l'utilisateur complet avec sa relation company
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ["company"],
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const cartoon = await this.cartoonRepository.findOne({
      where: { id },
      relations: ["chain", "chain.company"],
    });

    if (!cartoon) {
      throw new NotFoundException("Dessin animé non trouvé");
    }

    // Vérifier que le dessin animé appartient à une chaîne de l'entreprise de l'utilisateur
    if (!fullUser.company || cartoon.chain.company.id !== fullUser.company.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier ce dessin animé",
      );
    }

    // Gérer la catégorie si elle est fournie dans le DTO
    if (dto.categoryCartoonId) {
      const categoryCartoon = await this.categoryCartoonRepository.findOne({
        where: { id: dto.categoryCartoonId },
      });

      if (!categoryCartoon) {
        throw new NotFoundException("Catégorie de dessin animé non trouvée");
      }

      cartoon.categoryCartoon = categoryCartoon;
    }

    // Supprimer categoryCartoonId et ratings du DTO pour éviter les erreurs
    // Les ratings ne peuvent pas être modifiés manuellement
    const { categoryCartoonId, ratings, ...cartoonData } = dto as any;

    Object.assign(cartoon, cartoonData);
    cartoon.updated_by = fullUser;

    await this.cartoonRepository.save(cartoon);

    // Recharger le dessin animé avec toutes ses relations
    const reloadedCartoon = await this.cartoonRepository.findOne({
      where: { id },
      relations: ["chain", "chain.company", "categoryCartoon", "likes"],
    });

    if (!reloadedCartoon) {
      throw new NotFoundException(
        "Erreur lors du rechargement du dessin animé",
      );
    }

    return reloadedCartoon;
  }

  /**
   * Supprimer un dessin animé
   */
  async delete(id: string, user: any): Promise<void> {
    // Récupérer l'utilisateur complet avec sa relation company
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ["company"],
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const cartoon = await this.cartoonRepository.findOne({
      where: { id },
      relations: ["chain", "chain.company"],
    });

    if (!cartoon) {
      throw new NotFoundException("Dessin animé non trouvé");
    }

    // Vérifier que le dessin animé appartient à une chaîne de l'entreprise de l'utilisateur
    if (!fullUser.company || cartoon.chain.company.id !== fullUser.company.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à supprimer ce dessin animé",
      );
    }

    await this.cartoonRepository.softDelete(id);
  }

  /**
   * Récupérer tous les dessins animés
   */
  async findAll(): Promise<Cartoon[]> {
    return await this.cartoonRepository.find({
      relations: ["chain", "chain.company", "categoryCartoon", "likes"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Récupérer tous les dessins animés avec pagination
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Cartoon>> {
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [cartoons, total] = await this.cartoonRepository.findAndCount({
      ...paginationOptions,
      relations: ["chain", "chain.company", "categoryCartoon", "likes"],
      order: { createdAt: "DESC" },
    });

    return PaginationHelper.createPaginationResult(
      cartoons,
      page,
      limit,
      total,
    );
  }

  /**
   * Récupérer tous les dessins animés d'une chaîne
   */
  async findByChain(chainId: string): Promise<Cartoon[]> {
    return await this.cartoonRepository.find({
      where: { chain: { id: chainId } },
      relations: ["chain", "categoryCartoon", "likes"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Récupérer tous les dessins animés d'une chaîne avec pagination
   */
  async findByChainPaginated(
    chainId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Cartoon>> {
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [cartoons, total] = await this.cartoonRepository.findAndCount({
      where: { chain: { id: chainId } },
      ...paginationOptions,
      relations: ["chain", "categoryCartoon", "likes"],
      order: { createdAt: "DESC" },
    });

    return PaginationHelper.createPaginationResult(
      cartoons,
      page,
      limit,
      total,
    );
  }

  /**
   * Récupérer un dessin animé par ID
   */
  async findOne(id: string): Promise<Cartoon> {
    const cartoon = await this.cartoonRepository.findOne({
      where: { id },
      relations: ["chain", "chain.company", "categoryCartoon", "likes"],
    });

    if (!cartoon) throw new NotFoundException("Dessin animé non trouvé");

    return cartoon;
  }
}
