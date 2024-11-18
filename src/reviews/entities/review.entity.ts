import { User } from 'src/auth/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number;

  @Column()
  rating: number;

  @Column()
  content: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.reviews, { eager: false }) // eager false: relations 옵션 사용해서 관계를 명시적으로 로드해야 함
  @JoinColumn({ name: 'userId' }) // userId를 외래 키로 설정
  user: User;
}
