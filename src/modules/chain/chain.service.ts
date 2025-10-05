import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateChainDto } from './dto/create.chain.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chain } from 'src/common/database/entities/chain.entity';
import { UpdateChainDto } from './dto/update.chain.dto';
import { PaginationHelper, PaginationResult } from 'src/common/helpers/pagination.helper';

@Injectable()
export class ChainService {
    constructor(
        @InjectRepository(Chain)
        private chainRepository: Repository<Chain>,
    ) { }

    async create(dto: CreateChainDto): Promise<{ chain: Chain; message: string }> {
        const chain = this.chainRepository.create(dto);
        const savedChain = await this.chainRepository.save(chain);

        return {
            chain: savedChain,
            message: 'Chaîne créée avec succès.',
        };
    }

    async update(id: string, dto: UpdateChainDto): Promise<{ status: true; message: string }> {
        const chain = await this.chainRepository.findOne({ where: { id } });
        if (!chain) throw new NotFoundException('Chaîne non trouvée');
        
        await this.chainRepository.update(id, dto);

        return {
            status: true,
            message: "Données de la chaîne modifiées avec succès.",
        };
    }

    async findAll(): Promise<Chain[]> {
        return await this.chainRepository.find();
    }

    async findAllPaginated(page: number = 1, limit: number = 10): Promise<PaginationResult<Chain>> {
        const paginationOptions = PaginationHelper.getPaginationOptions(page, limit);
        
        const [chains, total] = await this.chainRepository.findAndCount({
            ...paginationOptions,
        });

        return PaginationHelper.createPaginationResult(chains, page, limit, total);
    }

    async findOne(id: string): Promise<Chain> {
        const chain = await this.chainRepository.findOne({ where: { id } });
        if (!chain) throw new NotFoundException('Chaîne non trouvée');
        return chain;
    }

    async delete(id: string): Promise<{ status: true; message: string }> {
        const chain = await this.chainRepository.findOne({ where: { id } });
        if (!chain) throw new NotFoundException('Chaîne non trouvée');
        
        await this.chainRepository.delete(id);
        return {
            status: true,
            message: "Chaîne supprimée avec succès.",
        };
    }

    async findBy(field: string, value: string): Promise<Chain | null> {
        return await this.chainRepository.findOne({ where: { [field]: value } });
    }
}
