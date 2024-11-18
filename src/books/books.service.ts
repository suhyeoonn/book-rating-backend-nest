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
      throw new ConflictException(`ISBN ${isbn} already exists.`);
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
