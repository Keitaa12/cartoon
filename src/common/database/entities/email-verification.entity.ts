import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('email_verifications')
@Index(['email', 'createdAt'])
@Index(['expiresAt'], { expireAfterSeconds: 0 })
export class EmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  verificationCode: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ default: false })
  isExpired: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
