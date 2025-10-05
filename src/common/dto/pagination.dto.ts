import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
    @ApiProperty({ 
        example: 1, 
        required: false, 
        description: 'Numéro de page (commence à 1)',
        minimum: 1
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: 'La page doit être un nombre.' })
    @Min(1, { message: 'La page doit être supérieure ou égale à 1.' })
    page?: number = 1;

    @ApiProperty({ 
        example: 10, 
        required: false, 
        description: 'Nombre d\'éléments par page',
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: 'La limite doit être un nombre.' })
    @Min(1, { message: 'La limite doit être supérieure ou égale à 1.' })
    @Max(100, { message: 'La limite ne peut pas dépasser 100.' })
    limit?: number = 10;
}
