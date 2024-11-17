import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { throwIfEmpty } from 'rxjs';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}
  create(createBookDto: CreateBookDto) {
    const { isbn } = createBookDto;

    const isExist = this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });
    if (isExist) {
      throw new HttpException(
        `ISBN ${isbn} already exists.`,
        HttpStatus.CONFLICT, // HTTP 409 상태 코드
      );
    }

    this.bookRepository.save(createBookDto).then(() => throwIfEmpty());
    return 'This action adds a new book';
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  findOne(id: number) {
    return this.bookRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.bookRepository.delete(id);
  }
}
