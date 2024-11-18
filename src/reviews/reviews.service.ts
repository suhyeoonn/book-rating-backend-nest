import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateReviewDto,
  ReviewCreateResponseDto,
} from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { DataSource, Repository } from 'typeorm';
import { GetReviewDto } from './dto/get-review.dto';
import { Book } from 'src/books/entities/book.entity';
import { ReviewDeleteResponseDto } from './dto/delete-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    bookId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewCreateResponseDto> {
    // 리뷰 생성 및 저장
    const savedReview = await this.saveReview(bookId, createReviewDto);

    return {
      review: savedReview,
      averageRating: await this.getAverageRating(bookId),
    };
  }

  private async saveReview(bookId: number, createReviewDto: CreateReviewDto) {
    const { content, rating } = createReviewDto;

    return this.reviewRepository.save({
      bookId,
      content,
      rating,
      userId: 1, // 실제 사용자 ID 처리 필요
    });
  }

  async findAll(bookId: number): Promise<GetReviewDto> {
    const reviews = await this.reviewRepository.find({
      where: { bookId },
    });

    return { bookId, reviews };
  }

  async remove(bookId: number, id: number): Promise<ReviewDeleteResponseDto> {
    await this.validateReview(id);

    await this.reviewRepository.delete(id);
    return { averageRating: await this.getAverageRating(bookId) };
  }

  private async validateBook(bookId: number) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book ${bookId} not found.`);
    }
  }

  private async validateReview(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }

  private async getAverageRating(bookId: number) {
    const result = await this.dataSource
      .createQueryBuilder()
      .select('AVG(review.rating)', 'averageRating')
      .from(Review, 'review')
      .where('review.bookId = :bookId', { bookId })
      .groupBy('review.bookId')
      .getRawOne();

    return Math.round(result?.averageRating || 0);
  }
}
