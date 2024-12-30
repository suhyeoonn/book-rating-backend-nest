import { User } from 'src/auth/entity/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { UserBook } from 'src/my-books/entities/user-book.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  // 여러 Review가 하나의 Book에 연결
  @ManyToOne(() => Book, (book) => book.reviews)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  // 하나의 Review는 하나의 UserBook과 연결
  @OneToOne(() => UserBook, (userBook) => userBook.review)
  userBook: UserBook;
}
