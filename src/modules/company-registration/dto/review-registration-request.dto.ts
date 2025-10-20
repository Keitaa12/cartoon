import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RegistrationStatusEnum } from "src/common/enums/registration-status.enum";

export class ReviewRegistrationRequestDto {
  @ApiProperty({
    description: "Statut de la demande",
    enum: RegistrationStatusEnum,
    example: RegistrationStatusEnum.APPROVED,
  })
  @IsNotEmpty({ message: "Le statut est requis" })
  @IsEnum(RegistrationStatusEnum, { message: "Statut invalide" })
  status: RegistrationStatusEnum;

  @ApiProperty({ description: "Raison du rejet (si rejeté)", required: false })
  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @ApiProperty({ description: "Notes de l'administrateur", required: false })
  @IsOptional()
  @IsString()
  admin_notes?: string;
}
