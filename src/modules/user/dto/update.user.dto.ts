import {
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/common/enums/user-role.enum';

export class UpdateUserDto {
    @ApiProperty({ example: 'Christian' })
    @IsNotEmpty({ message: 'Le prénoms est obligatoire.' })
    @IsString({ message: 'Le prénoms doit être une chaîne de caractères.' })
    first_name: string;

    @ApiProperty({ example: 'Kone' })
    @IsNotEmpty({ message: 'Le nom est obligatoire.' })
    @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
    last_name: string;

    @ApiProperty({ example: 'admin@auchan.ci' })
    @IsNotEmpty({ message: 'Le email est obligatoire.' })
    @IsEmail({}, { message: 'Le email doit être une adresse email valide.' })
    @IsString({ message: 'Le email doit être une chaîne de caractères.' })
    email: string;

    @ApiProperty({ example: UserRoleEnum.USER })
    @IsString({ message: 'Le rôle doit être une chaîne de caractères.' })
    @IsIn([UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.CREATOR], {
        message: "Le rôle doit être l'un des suivants : admin, user, creator.",
    })

    @IsNotEmpty({ message: 'Le rôle est obligatoire.' })
    role: UserRoleEnum;
}
