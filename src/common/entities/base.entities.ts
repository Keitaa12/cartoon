import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/common/database/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

export default class BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;

  @ApiProperty({ required: false })
  @ManyToOne(() => User, { nullable: true })
  deleted_by?: User | null;
}
