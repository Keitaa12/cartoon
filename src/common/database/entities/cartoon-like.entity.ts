import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import BaseEntity from "src/common/entities/base.entities";
import { Cartoon } from "./cartoon.entity";
import { User } from "./user.entity";

@Entity("cartoon_likes")
@Unique(["cartoon", "user"])
export class CartoonLike extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
}

