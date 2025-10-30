import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import BaseEntity from "src/common/entities/base.entities";
import { Cartoon } from "./cartoon.entity";
import { User } from "./user.entity";

@Entity("cartoon_ratings")
@Unique(["cartoon", "user"])
export class CartoonRating extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ type: "decimal", precision: 3, scale: 2 })
  rating: number;

  @ApiProperty()
  @ManyToOne(() => Cartoon, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "cartoon_id" })
  cartoon: Cartoon;

  @ApiProperty()
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  updated_by?: User | null;
}
