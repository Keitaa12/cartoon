import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { CartoonComment } from "src/common/database/entities/cartoon-comment.entity";
import { Cartoon } from "src/common/database/entities/cartoon.entity";
import { User } from "src/common/database/entities/user.entity";
import { CreateCartoonCommentDto } from "./dto/create.cartoon-comment.dto";
import { UpdateCartoonCommentDto } from "./dto/update.cartoon-comment.dto";
import {
  PaginationHelper,
  PaginationResult,
} from "src/common/helpers/pagination.helper";

@Injectable()
export class CartoonCommentService {
  constructor(
    @InjectRepository(CartoonComment)
    private cartoonCommentRepository: Repository<CartoonComment>,
    @InjectRepository(Cartoon)
    private cartoonRepository: Repository<Cartoon>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Créer un commentaire
   */
  async create(
    cartoonId: string,
    dto: CreateCartoonCommentDto,
    user: any,
  ): Promise<CartoonComment> {
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

    // Gérer le commentaire parent si fourni
    let parentComment: CartoonComment | null = null;
    if (dto.parentCommentId) {
      parentComment = await this.cartoonCommentRepository.findOne({
        where: { id: dto.parentCommentId },
        relations: ["cartoon"],
      });

      if (!parentComment) {
        throw new NotFoundException("Commentaire parent non trouvé");
      }

      // Vérifier que le commentaire parent appartient au même cartoon
      if (parentComment.cartoon.id !== cartoonId) {
        throw new BadRequestException(
          "Le commentaire parent n'appartient pas à ce dessin animé",
        );
      }
    }

    const comment = this.cartoonCommentRepository.create({
      content: dto.content,
      cartoon: cartoon,
      user: fullUser,
      parentComment: parentComment || undefined,
      created_by: fullUser,
    });

    const savedComment = await this.cartoonCommentRepository.save(comment);

    // Recharger le commentaire avec ses relations
    const reloadedComment = await this.cartoonCommentRepository.findOne({
      where: { id: savedComment.id },
      relations: ["cartoon", "user", "parentComment"],
    });

    if (!reloadedComment) {
      throw new NotFoundException("Erreur lors du rechargement du commentaire");
    }

    return reloadedComment;
  }

  /**
   * Mettre à jour un commentaire
   */
  async update(
    id: string,
    dto: UpdateCartoonCommentDto,
    user: any,
  ): Promise<CartoonComment> {
    // Récupérer l'utilisateur complet
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const comment = await this.cartoonCommentRepository.findOne({
      where: { id },
      relations: ["cartoon", "user"],
    });

    if (!comment) {
      throw new NotFoundException("Commentaire non trouvé");
    }

    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.user.id !== user.sub) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier ce commentaire",
      );
    }

    Object.assign(comment, dto);
    comment.updated_by = fullUser;

    await this.cartoonCommentRepository.save(comment);

    // Recharger le commentaire avec ses relations
    const reloadedComment = await this.cartoonCommentRepository.findOne({
      where: { id },
      relations: ["cartoon", "user", "parentComment"],
    });

    if (!reloadedComment) {
      throw new NotFoundException("Erreur lors du rechargement du commentaire");
    }

    return reloadedComment;
  }

  /**
   * Supprimer un commentaire
   */
  async delete(id: string, user: any): Promise<void> {
    // Récupérer l'utilisateur complet
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const comment = await this.cartoonCommentRepository.findOne({
      where: { id },
      relations: ["user", "cartoon"],
    });

    if (!comment) {
      throw new NotFoundException("Commentaire non trouvé");
    }

    // Vérifier que l'utilisateur est le propriétaire du commentaire
    if (comment.user.id !== user.sub) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à supprimer ce commentaire",
      );
    }

    await this.cartoonCommentRepository.softDelete(id);
  }

  /**
   * Récupérer tous les commentaires d'un cartoon
   */
  async findByCartoon(cartoonId: string): Promise<CartoonComment[]> {
    return await this.cartoonCommentRepository.find({
      where: { cartoon: { id: cartoonId }, parentComment: IsNull() },
      relations: ["cartoon", "user"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Récupérer tous les commentaires d'un cartoon avec pagination
   */
  async findByCartoonPaginated(
    cartoonId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<CartoonComment>> {
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [comments, total] = await this.cartoonCommentRepository.findAndCount(
      {
        where: { cartoon: { id: cartoonId }, parentComment: IsNull() },
        ...paginationOptions,
        relations: ["cartoon", "user"],
        order: { createdAt: "DESC" },
      },
    );

    return PaginationHelper.createPaginationResult(comments, page, limit, total);
  }

  /**
   * Récupérer les réponses à un commentaire
   */
  async findByParentComment(parentCommentId: string): Promise<CartoonComment[]> {
    return await this.cartoonCommentRepository.find({
      where: { parentComment: { id: parentCommentId } },
      relations: ["user"],
      order: { createdAt: "ASC" },
    });
  }

  /**
   * Récupérer un commentaire par ID
   */
  async findOne(id: string): Promise<CartoonComment> {
    const comment = await this.cartoonCommentRepository.findOne({
      where: { id },
      relations: ["cartoon", "user", "parentComment"],
    });

    if (!comment) throw new NotFoundException("Commentaire non trouvé");

    return comment;
  }
}

