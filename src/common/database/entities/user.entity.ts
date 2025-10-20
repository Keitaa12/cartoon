import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoleEnum } from "src/common/enums/user-role.enum";
import BaseEntity from "src/common/entities/base.entities";
import { Company } from "./company.entity";

@Entity("users")
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  first_name: string;

  @ApiProperty()
  @Column()
  last_name: string;

  @ApiProperty({ enum: ["admin", "creator", "user"] })
  @Column({ type: "enum", enum: UserRoleEnum })
  role: UserRoleEnum;

  @ApiProperty()
  @Column({ default: false })
  is_locked: boolean;

  @ApiProperty()
  @Column({ default: false })
  is_verified: boolean;

  @ApiProperty({ required: false })
  @ManyToOne(() => Company, { nullable: true })
  company?: Company | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  locked_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  updated_by?: User | null;
}
