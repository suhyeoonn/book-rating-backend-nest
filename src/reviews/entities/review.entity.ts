import {
  Column,
  Entity,
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
}
