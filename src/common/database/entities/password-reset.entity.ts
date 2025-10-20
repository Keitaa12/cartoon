import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("password_resets")
@Index(["email", "createdAt"])
@Index(["expiresAt"], { expireAfterSeconds: 0 })
export class PasswordReset {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  otp: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ default: false })
  isExpired: boolean;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @Column({ type: "uuid", nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
