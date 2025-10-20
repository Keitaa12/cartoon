import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chain } from "src/common/database/entities/chain.entity";
import { Company } from "src/common/database/entities/company.entity";
import { User } from "src/common/database/entities/user.entity";
import { CreateChainDto } from "./dto/create.chain.dto";
import { UpdateChainDto } from "./dto/update.chain.dto";
import {
  PaginationHelper,
  PaginationResult,
} from "src/common/helpers/pagination.helper";

@Injectable()
export class ChainService {
  constructor(
    @InjectRepository(Chain)
    private chainRepository: Repository<Chain>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Créer une chaîne pour l'entreprise de l'utilisateur connecté
   * Une entreprise ne peut avoir qu'une seule chaîne
   */
  async create(dto: CreateChainDto, user: any): Promise<Chain> {
    // Récupérer l'utilisateur complet avec sa relation company
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ["company"],
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    // Vérifier que l'utilisateur a une entreprise
    if (!fullUser.company) {
      throw new BadRequestException(
        "Vous devez être associé à une entreprise pour créer une chaîne",
      );
    }

    // Vérifier que l'entreprise est active
    const company = await this.companyRepository.findOne({
      where: { id: fullUser.company.id },
    });

    if (!company || !company.is_active) {
      throw new BadRequestException("Votre entreprise n'est pas active");
    }

    // Vérifier que l'entreprise n'a pas déjà une chaîne
    const existingChain = await this.chainRepository.findOne({
      where: { company: { id: company.id } },
    });

    if (existingChain) {
      throw new BadRequestException(
        "Votre entreprise a déjà une chaîne. Une entreprise ne peut avoir qu'une seule chaîne.",
      );
    }

    const chain = this.chainRepository.create({
      ...dto,
      company: company,
      created_by: fullUser,
    });

    return await this.chainRepository.save(chain);
  }

  /**
   * Mettre à jour une chaîne (seulement si elle appartient à l'entreprise de l'utilisateur)
   */
  async update(id: string, dto: UpdateChainDto, user: any): Promise<Chain> {
    // Récupérer l'utilisateur complet avec sa relation company
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ["company"],
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    const chain = await this.chainRepository.findOne({
      where: { id },
      relations: ["company"],
    });

    if (!chain) {
      throw new NotFoundException("Chaîne non trouvée");
    }

    // Vérifier que la chaîne appartient à l'entreprise de l'utilisateur
    if (!fullUser.company || chain.company.id !== fullUser.company.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier cette chaîne",
      );
    }

    Object.assign(chain, dto);
    chain.updated_by = fullUser;

    return await this.chainRepository.save(chain);
  }

  /**
   * Supprimer une chaîne (seulement si elle appartient à l'entreprise de l'utilisateur)
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

    const chain = await this.chainRepository.findOne({
      where: { id },
      relations: ["company"],
    });

    if (!chain) {
      throw new NotFoundException("Chaîne non trouvée");
    }

    // Vérifier que la chaîne appartient à l'entreprise de l'utilisateur
    if (!fullUser.company || chain.company.id !== fullUser.company.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à supprimer cette chaîne",
      );
    }

    await this.chainRepository.softDelete(id);
  }

  /**
   * Récupérer toutes les chaînes
   */
  async findAll(): Promise<Chain[]> {
    return await this.chainRepository.find({
      relations: ["company"],
      order: { name: "ASC" },
    });
  }

  /**
   * Récupérer toutes les chaînes avec pagination
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResult<Chain>> {
    const paginationOptions = PaginationHelper.getPaginationOptions(
      page,
      limit,
    );

    const [chains, total] = await this.chainRepository.findAndCount({
      ...paginationOptions,
      relations: ["company"],
      order: { name: "ASC" },
    });

    return PaginationHelper.createPaginationResult(chains, page, limit, total);
  }

  /**
   * Récupérer une chaîne par ID
   */
  async findOne(id: string): Promise<Chain> {
    const chain = await this.chainRepository.findOne({
      where: { id },
      relations: ["company"],
    });

    if (!chain) throw new NotFoundException("Chaîne non trouvée");

    return chain;
  }

  /**
   * Récupérer la chaîne d'une entreprise (une seule chaîne par entreprise)
   */
  async findByCompany(companyId: string): Promise<Chain | null> {
    return await this.chainRepository.findOne({
      where: { company: { id: companyId } },
      relations: ["company"],
    });
  }

  /**
   * Récupérer la chaîne de l'entreprise de l'utilisateur connecté
   */
  async findMyChain(user: any): Promise<Chain | null> {
    // Récupérer l'utilisateur complet avec sa relation company
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ["company"],
    });

    if (!fullUser) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    if (!fullUser.company) {
      throw new BadRequestException("Vous devez être associé à une entreprise");
    }

    return await this.findByCompany(fullUser.company.id);
  }
}
