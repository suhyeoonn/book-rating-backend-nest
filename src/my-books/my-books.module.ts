import { Module } from '@nestjs/common';
import { UserBooksService } from './my-books.service';
import { MyBooksController } from './my-books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { UserBook } from './entities/user-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, UserBook])],
  controllers: [MyBooksController],
  providers: [UserBooksService],
})
export class UserBooksModule {}
