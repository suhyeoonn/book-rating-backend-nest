import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResponseDto, CreateUserBookDto } from './dto/create-my-book.dto';
import { UpdateReviewDto, UpdateStatusDto } from './dto/update-my-book.dto';
import { Book } from 'src/books/entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBook } from './entities/user-book.entity';
import { GetMyBooks } from './dto/get-my-books.dto';

@Injectable()
export class UserBooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(UserBook)
    private userBookRepository: Repository<UserBook>,
  ) {}

  async create(
    createBookDto: CreateUserBookDto,
    userId: number,
  ): Promise<CreateResponseDto> {
    let book = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (book) {
      const isExist = await this.userBookRepository.findOne({
        where: { userId, book: { id: book.id } },
      });
      if (isExist) {
        throw new ConflictException(`This book is already registered.`);
      }
    } else {
      book = await this.bookRepository.save(createBookDto);
      if (!book) {
        throw new Error('Failed to save the book.');
      }
    }

    const userBook = await this.userBookRepository.save({
      userId,
      book,
    });
    return { id: userBook.id };
  }

  async findAll(userId: number): Promise<GetMyBooks[]> {
    const result = await this.userBookRepository
      .createQueryBuilder('userBook')
      .leftJoinAndSelect('userBook.book', 'book')
      .leftJoinAndSelect('userBook.review', 'review')
      .select([
        'userBook.id',
        'userBook.status',
        'userBook.createdAt',
        'userBook.updatedAt',
        'userBook.finishedAt',
        'book.id',
        'book.title',
        'review.rating',
      ])
      .where('userBook.userId = :userId', { userId })
      .getRawMany();

    return result.map((row) => ({
      id: row.userBook_id,
      status: row.userBook_status,
      createdAt: row.userBook_createdAt,
      updatedAt: row.userBook_updatedAt,
      finishedAt: row.userBook_finishedAt,
      book: {
        id: row.book_id,
        title: row.book_title,
      },
      rating: row.review_rating,
    }));
  }

  async findOne(id: number) {
    return await this.userBookRepository.findOne({
      where: { id },
      relations: ['book', 'review'],
    });
  }

  // TODO: memo로 변경
  async updateReview(id: number, updateUserBookDto: UpdateReviewDto) {
    return await this.userBookRepository.update(
      { id },
      { memo: updateUserBookDto.review },
    );
  }

  async updateStatus(id: number, updateDto: UpdateStatusDto) {
    return await this.userBookRepository.update(
      { id },
      { status: updateDto.status },
    );
  }

  async remove(id: number) {
    return await this.userBookRepository.delete({ id });
  }

  async isBookInMyList(
    isbn: string,
    userId: number,
  ): Promise<{ exists: boolean }> {
    const book = await this.bookRepository.findOne({ where: { isbn } });
    if (!book) throw new NotFoundException();

    const exists = await this.userBookRepository.findOne({
      where: {
        userId,
        book: { id: book.id },
      },
    });

    return { exists: !!exists };
  }
}
