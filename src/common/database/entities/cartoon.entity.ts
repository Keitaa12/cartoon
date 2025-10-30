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
import { Chain } from "./chain.entity";
import { User } from "./user.entity";
import { CategoryCartoon } from "./category-cartoon.entity";
import { CartoonRating } from "./cartoon-rating.entity";
import { CartoonComment } from "./cartoon-comment.entity";
import { CartoonLike } from "./cartoon-like.entity";

@Entity("cartoons")
export class Cartoon extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({ name: "image_background_url" })
  imageBackgroundUrl: string;

  @ApiProperty()
  @Column({ name: "video_url" })
  videoUrl: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: "text" })
  description: string;

  @ApiProperty()
  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  ratings: number;

  @ApiProperty()
  @ManyToOne(() => Chain, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "chain_id" })
  chain: Chain;

  @ApiProperty({ required: false })
  @ManyToOne(() => CategoryCartoon, { nullable: true })
  @JoinColumn({ name: "category_cartoon_id" })
  categoryCartoon?: CategoryCartoon | null;

  @ApiProperty({ required: false })
  @OneToMany(() => CartoonRating, (rating) => rating.cartoon)
  userRatings?: CartoonRating[];

  @ApiProperty({ required: false })
  @OneToMany(() => CartoonComment, (comment) => comment.cartoon)
  comments?: CartoonComment[];

  @ApiProperty({ required: false })
  @OneToMany(() => CartoonLike, (like) => like.cartoon)
  likes?: CartoonLike[];

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  updated_by?: User | null;
}
