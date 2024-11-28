import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entities/book.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entity/user.entity';
import { UserBooksModule } from './my-books/my-books.module';
import { UserBook } from './my-books/entities/user-book.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [Book, Review, User, UserBook],
      synchronize: true,
    }),
    BooksModule,
    ReviewsModule,
    AuthModule,
    UserBooksModule,
  ],
})
export class AppModule {}
