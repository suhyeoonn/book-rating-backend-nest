import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DataSource, Repository } from 'typeorm';
import { throwIfEmpty } from 'rxjs';
import { GetBooksDto } from './dto/get-books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const { isbn } = createBookDto;

    const isExist = await this.bookRepository.findOne({
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

  async findAll(): Promise<GetBooksDto[]> {
    // 책 정보와 평균 점수 조회
    const result = await this.dataSource.query(
      `
      SELECT 
        book.id, isbn, title, thumbnail, IFNULL(Round(AVG(rating), 0), 0) as averageRating 
      FROM book 
      LEFT JOIN review ON review.bookId = book.id 
      GROUP BY book.id`,
    );

    return result.map((book) => ({
      ...book,
      averageRating: +book.averageRating,
    }));
  }

  findOne(id: number) {
    return this.bookRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.bookRepository.delete(id);
  }
}
