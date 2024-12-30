import { UserBook } from 'src/my-books/entities/user-book.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  isbn: string;

  @Column()
  title: string;
  //   tags: Tag[];

  @Column()
  thumbnail: string;

  @Column({ type: 'text' })
  contents: string;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @Column({ type: 'text' })
  url: string;

  @Column()
  authors: string;

  @Column()
  publisher: string;

  @OneToMany(() => UserBook, (userBook) => userBook.book)
  userBooks: UserBook[];

  // 하나의 책은 여러 Review와 관계
  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];
}
