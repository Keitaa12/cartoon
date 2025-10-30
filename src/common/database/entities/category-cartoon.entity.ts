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
import { User } from "./user.entity";
import { Cartoon } from "./cartoon.entity";

@Entity("category_cartoons")
export class CategoryCartoon extends BaseEntity {
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
  @Column({ nullable: true })
  color: string;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  updated_by?: User | null;

  @ApiProperty({ required: false })
  @OneToMany(() => Cartoon, (cartoon) => cartoon.categoryCartoon)
  cartoons?: Cartoon[];
}
