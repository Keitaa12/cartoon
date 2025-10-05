import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";
import { CreateChainDto } from "./dto/create.chain.dto";
import { ChainService } from "./chain.service";
import { UpdateChainDto } from "./dto/update.chain.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { PaginationDto } from "src/common/dto/pagination.dto";

@ApiTags('Chain')
@Controller('chain')
export class ChainController {
    constructor(private readonly chainService: ChainService) {}

    @ApiOperation({ summary: 'Ajouter une chaîne' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateChainDto) {
      return await this.chainService.create(dto);
    }

    @ApiOperation({ summary: 'Modifier une chaîne' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateChainDto) {
      return await this.chainService.update(id, dto);
    }
    
    @ApiOperation({ summary: 'Obtenir toutes les chaînes' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll() {
      return await this.chainService.findAll();
    }

    @ApiOperation({ 
        summary: 'Obtenir toutes les chaînes avec pagination',
        description: 'Récupère la liste des chaînes avec pagination. Utilisez les paramètres page et limit pour contrôler la pagination.'
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page (commence à 1)', example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page (max 100)', example: 10 })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('paginated')
    async findAllPaginated(@Query() paginationDto: PaginationDto) {
      return await this.chainService.findAllPaginated(paginationDto.page, paginationDto.limit);
    }

    @ApiOperation({ summary: 'Obtenir une chaîne' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return await this.chainService.findOne(id);
    }

    @ApiOperation({ summary: 'Supprimer une chaîne' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return await this.chainService.delete(id);
    }
}
