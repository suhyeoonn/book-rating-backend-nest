import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
