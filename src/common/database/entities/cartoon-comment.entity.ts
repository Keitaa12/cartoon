import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import BaseEntity from "src/common/entities/base.entities";
import { Cartoon } from "./cartoon.entity";
import { User } from "./user.entity";

@Entity("cartoon_comments")
export class CartoonComment extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ type: "text" })
  content: string;

  @ApiProperty()
  @ManyToOne(() => Cartoon, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "cartoon_id" })
  cartoon: Cartoon;

  @ApiProperty()
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ApiProperty({ required: false })
  @ManyToOne(() => CartoonComment, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_comment_id" })
  parentComment?: CartoonComment | null;

  @ApiProperty({ required: false })
  @OneToMany(() => CartoonComment, (comment) => comment.parentComment)
  replies?: CartoonComment[];

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  updated_by?: User | null;
}
