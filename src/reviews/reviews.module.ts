import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Book } from 'src/books/entities/book.entity';
import { UserBook } from 'src/my-books/entities/user-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Book, UserBook])],
  exports: [TypeOrmModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
