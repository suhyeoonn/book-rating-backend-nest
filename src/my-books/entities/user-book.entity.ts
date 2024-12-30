import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity()
export class UserBook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  // 하나의 책은 여러명이 등록할 수 있다.
  @ManyToOne(() => Book, (book) => book.userBooks)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  // 하나의 UserBook은 하나의 Review와 연결
  @OneToOne(() => Review, (review) => review.userBook, { nullable: true })
  @JoinColumn({ name: 'reviewId' })
  review: Review;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ type: 'text', nullable: true })
  memo: string;

  // TODO: 제거
  @Column({ type: 'tinyint', default: 0 })
  rating: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;
}
