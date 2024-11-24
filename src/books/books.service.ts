import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DataSource, Repository } from 'typeorm';
import { GetBooksDto } from './dto/get-books.dto';
import { Review } from 'src/reviews/entities/review.entity';
import { GetBookDto } from './dto/get-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { isbn } = createBookDto;

    const isExist = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (isExist) {
      throw new ConflictException(`ISBN ${isbn} already exists.`);
    }

    const savedBook = await this.bookRepository.save(createBookDto);
    if (!savedBook) {
      throw new Error('Failed to save the book.');
    }

    return savedBook;
  }

  async findAll(): Promise<GetBooksDto[]> {
    // 책 정보와 평균 점수 조회
    const result = await this.dataSource.query(
      `
      SELECT 
        book.id, isbn, title, thumbnail, 
        IFNULL(Round(AVG(rating), 0), 0) as averageRating, COUNT(rating) as reviewCount 
      FROM book 
      LEFT JOIN review ON review.bookId = book.id 
      GROUP BY book.id`,
    );

    return result.map((book) => ({
      ...book,
      averageRating: +book.averageRating,
    }));
  }

  async findOne(id: number): Promise<GetBookDto> {
    await this.validateBook(id);

    const result = await this.dataSource.query(
      `
      SELECT 
        book.id, isbn, title, thumbnail, contents, datetime, url, authors, publisher, 
        IFNULL(Round(AVG(rating), 0), 0) as averageRating 
      FROM book 
      LEFT JOIN review ON review.bookId = book.id 
      WHERE book.id = ${id}
      GROUP BY book.id`,
    );

    const book = result[0];

    return { ...book };
  }

  async remove(id: number) {
    await this.validateBook(id);

    await this.checkHasReview(id);

    return this.bookRepository.delete(id);
  }

  async validateBook(bookId: number) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book ${bookId} not found.`);
    }
  }

  async checkHasReview(bookId: number) {
    const count = await this.reviewRepository.count({ where: { bookId } });
    if (count) {
      throw new BadRequestException(
        `Cannot delete book ${bookId} with ${count} reviews.`,
      );
    }
  }
}
