import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResponseDto, CreateUserBookDto } from './dto/create-my-book.dto';
import {
  UpdateRatingDto,
  UpdateReviewDto,
  UpdateStatusDto,
} from './dto/update-my-book.dto';
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
    return await this.userBookRepository
      .createQueryBuilder('userBook')
      .leftJoinAndSelect('userBook.book', 'book')
      .select([
        'userBook.id',
        'userBook.rating',
        'userBook.status',
        'userBook.createdAt',
        'userBook.updatedAt',
        'userBook.finishedAt',
        'book.id',
        'book.title',
      ])
      .where('userBook.userId = :userId', { userId })
      .getMany();
  }

  async findOne(id: number) {
    return await this.userBookRepository.findOne({
      where: { id },
      relations: ['book'],
    });
  }

  async updateReview(id: number, updateUserBookDto: UpdateReviewDto) {
    return await this.userBookRepository.update(
      { id },
      { review: updateUserBookDto.review },
    );
  }

  async updateStatus(id: number, updateDto: UpdateStatusDto) {
    return await this.userBookRepository.update(
      { id },
      { status: updateDto.status },
    );
  }

  async updateRating(id: number, updateDto: UpdateRatingDto) {
    return await this.userBookRepository.update(
      { id },
      { rating: updateDto.rating },
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
