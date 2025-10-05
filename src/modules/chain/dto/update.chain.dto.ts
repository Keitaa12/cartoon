import {
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
    IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChainDto {
    @ApiProperty({ example: 'McDonald\'s' })
    @IsNotEmpty({ message: 'Le nom est obligatoire.' })
    @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
    @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
    @MaxLength(100, { message: 'Le nom doit contenir au plus 100 caractères.' })
    name: string;

    @ApiProperty({ example: 'Restaurant de fast-food américain spécialisé dans les hamburgers' })
    @IsNotEmpty({ message: 'La description est obligatoire.' })
    @IsString({ message: 'La description doit être une chaîne de caractères.' })
    @MinLength(10, { message: 'La description doit contenir au moins 10 caractères.' })
    @MaxLength(500, { message: 'La description doit contenir au plus 500 caractères.' })
    description: string;

    @ApiProperty({ example: 'https://example.com/images/mcdonalds-logo.png' })
    @IsNotEmpty({ message: 'L\'URL de l\'image est obligatoire.' })
    @IsString({ message: 'L\'URL de l\'image doit être une chaîne de caractères.' })
    @IsUrl({}, { message: 'L\'URL de l\'image doit être une URL valide.' })
    imageUrl: string;
}
