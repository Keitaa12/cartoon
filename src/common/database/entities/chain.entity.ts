import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import BaseEntity from 'src/common/entities/base.entities';
import { User } from './user.entity';

@Entity('chains')
export class Chain extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column()
  imageUrl: string;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  created_by?: User | null;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  updated_by?: User | null;
}
