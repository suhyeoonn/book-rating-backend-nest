import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DataSource, Repository } from 'typeorm';
import { throwIfEmpty } from 'rxjs';
import { GetBooksDto } from './dto/get-books.dto';
import { Review } from 'src/reviews/entities/review.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
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

  async remove(id: number) {
    // 책이 존재하는지 확인
    const exists = await this.bookRepository.findOne({ where: { id } });
    if (!exists) {
      throw new HttpException(`Book ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    // 책에 연결된 리뷰가 있는지 확인
    const count = await this.reviewRepository.count({ where: { bookId: id } });
    if (count) {
      throw new HttpException(
        `Cannot delete book ${id} with ${count} reviews.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.bookRepository.delete(id);
  }
}
