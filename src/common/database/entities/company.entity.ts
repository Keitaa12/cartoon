import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import BaseEntity from "src/common/entities/base.entities";
import { User } from "./user.entity";

@Entity("companies")
export class Company extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  description: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column({ nullable: true })
  city: string;

  @ApiProperty()
  @Column({ nullable: true })
  country: string;

  @ApiProperty()
  @Column({ nullable: true })
  postal_code: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @Column({ nullable: true })
  website: string;

  @ApiProperty()
  @Column({ nullable: true })
  logo_url: string;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  updated_by?: User | null;
}
