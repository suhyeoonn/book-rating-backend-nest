import { ConflictException, Injectable } from '@nestjs/common';
import { CreateResponseDto, CreateUserBookDto } from './dto/create-my-book.dto';
import { UpdateUserBookDto } from './dto/update-my-book.dto';
import { Book } from 'src/books/entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBook } from './entities/user-book.entity';

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

  async findAll(userId: number) {
    return await this.userBookRepository
      .createQueryBuilder('userBook')
      .leftJoinAndSelect('userBook.book', 'book') // book 테이블 조인
      .where('userBook.userId = :userId', { userId })
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} userBook`;
  }

  update(id: number, updateUserBookDto: UpdateUserBookDto) {
    return `This action updates a #${id} userBook`;
  }

  remove(id: number) {
    return `This action removes a #${id} userBook`;
  }
}
