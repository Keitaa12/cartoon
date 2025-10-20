import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import BaseEntity from "src/common/entities/base.entities";
import { User } from "./user.entity";
import { Company } from "./company.entity";
import { RegistrationStatusEnum } from "src/common/enums/registration-status.enum";

@Entity("company_registration_requests")
export class CompanyRegistrationRequest extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // Informations de l'entreprise
  @ApiProperty()
  @Column()
  company_name: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  company_description: string;

  @ApiProperty()
  @Column()
  company_address: string;

  @ApiProperty()
  @Column({ nullable: true })
  company_city: string;

  @ApiProperty()
  @Column({ nullable: true })
  company_country: string;

  @ApiProperty()
  @Column({ nullable: true })
  company_postal_code: string;

  @ApiProperty()
  @Column()
  company_email: string;

  @ApiProperty()
  @Column({ nullable: true })
  company_phone: string;

  @ApiProperty()
  @Column({ nullable: true })
  company_website: string;

  // Informations d'authentification (utilise company_email comme email du compte)
  @ApiProperty()
  @Column()
  password: string; // Mot de passe haché

  // Statut de la demande
  @ApiProperty({ enum: ["pending", "approved", "rejected"] })
  @Column({
    type: "enum",
    enum: RegistrationStatusEnum,
    default: RegistrationStatusEnum.PENDING,
  })
  status: RegistrationStatusEnum;

  @ApiProperty({ required: false })
  @Column({ type: "text", nullable: true })
  rejection_reason?: string | null; // Raison du rejet si applicable

  @ApiProperty({ required: false })
  @Column({ type: "text", nullable: true })
  admin_notes?: string | null; // Notes de l'administrateur

  // Relations
  @ApiProperty({ required: false })
  @ManyToOne(() => Company, { nullable: true })
  company?: Company | null; // Lien vers l'entreprise créée si approuvée

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_user?: User | null; // Lien vers le compte utilisateur créé si approuvé

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  reviewed_by?: User | null; // Admin qui a traité la demande
}
