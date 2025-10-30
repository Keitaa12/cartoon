import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryCartoon } from "src/common/database/entities/category-cartoon.entity";
import { User } from "src/common/database/entities/user.entity";
import { CreateCategoryCartoonDto } from "./dto/create.category-cartoon.dto";
import { UpdateCategoryCartoonDto } from "./dto/update.category-cartoon.dto";
import {
  PaginationHelper,
  PaginationResult,
} from "src/common/helpers/pagination.helper";

@Injectable()
export class CategoryCartoonService {
  constructor(
    @InjectRepository(CategoryCartoon)
    private categoryCartoonRepository: Repository<CategoryCartoon>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Créer une catégorie de dessin animé
   */
  async create(
    dto: CreateCategoryCartoonDto,
    user: any,
  ): Promise<CategoryCartoon> {
    // Récupérer l'utilisateur complet
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const categoryCartoon = this.categoryCartoonRepository.create({
      ...dto,
      created_by: fullUser,
    });

    return await this.categoryCartoonRepository.save(categoryCartoon);
  }

  /**
   * Mettre à jour une catégorie de dessin animé
   */
  async update(
    id: string,
    dto: UpdateCategoryCartoonDto,
    user: any,
  ): Promise<CategoryCartoon> {
    // Récupérer l'utilisateur complet
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const categoryCartoon = await this.categoryCartoonRepository.findOne({
      where: { id },
    });

    if (!categoryCartoon) {
      throw new NotFoundException("Catégorie non trouvée");
    }

    Object.assign(categoryCartoon, dto);
    categoryCartoon.updated_by = fullUser;

    return await this.categoryCartoonRepository.save(categoryCartoon);
  }

  /**
   * Supprimer une catégorie de dessin animé
   */
  async delete(id: string): Promise<void> {
    const categoryCartoon = await this.categoryCartoonRepository.findOne({
      where: { id },
      relations: ["cartoons"],
    });

    if (!categoryCartoon) {
      throw new NotFoundException("Catégorie non trouvée");
    }

    // Vérifier si la catégorie contient des dessins animés
    if (categoryCartoon.cartoons && categoryCartoon.cartoons.length > 0) {
      throw new BadRequestException(
        "Impossible de supprimer une catégorie qui contient des dessins animés",
      );
    }

    await this.categoryCartoonRepository.softDelete(id);
  }

  /**
   * Récupérer toutes les catégories
   */
  async findAll(): Promise<CategoryCartoon[]> {
    return await this.categoryCartoonRepository.find({
      order: { name: "ASC" },
    });
  }

  /**
   * Récupérer toutes les catégories avec pagination
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<CategoryCartoon>> {
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [categories, total] =
      await this.categoryCartoonRepository.findAndCount({
        ...paginationOptions,
        order: { name: "ASC" },
      });

    return PaginationHelper.createPaginationResult(
      categories,
      page,
      limit,
      total,
    );
  }

  /**
   * Récupérer une catégorie par ID
   */
  async findOne(id: string): Promise<CategoryCartoon> {
    const category = await this.categoryCartoonRepository.findOne({
      where: { id },
      relations: ["cartoons"],
    });

    if (!category) throw new NotFoundException("Catégorie non trouvée");

    return category;
  }
}
