import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateReviewDto,
  ReviewCreateResponseDto,
} from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { DataSource, Repository } from 'typeorm';
import { GetReviewDto, ReviewItemDto } from './dto/get-review.dto';
import { Book } from 'src/books/entities/book.entity';
import { ReviewDeleteResponseDto } from './dto/delete-review.dto';
import {
  ReviewUpdateResponseDto,
  UpdateReviewDto,
} from './dto/update-review.dto';

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
    userId: number,
  ): Promise<ReviewCreateResponseDto> {
    const { content, rating } = createReviewDto;
    const savedReview = await this.reviewRepository.save({
      bookId,
      content,
      rating,
      userId,
    });

    return {
      review: savedReview,
      averageRating: await this.getAverageRating(bookId),
    };
  }

  async findAll(bookId: number): Promise<GetReviewDto> {
    const reviews = await this.reviewRepository.find({
      where: { bookId },
      relations: ['user'],
    });

    const filteredReviews = reviews.map(
      ({ id, rating, content, updatedAt, user }) => ({
        id,
        rating,
        content,
        updatedAt,
        user: {
          id: user.id,
          username: user.username,
        },
      }),
    );

    return { bookId, reviews: filteredReviews };
  }

  async remove(
    bookId: number,
    id: number,
    userId: number,
  ): Promise<ReviewDeleteResponseDto> {
    await this.validateReview(id, userId);

    await this.reviewRepository.delete(id);
    return { averageRating: await this.getAverageRating(bookId) };
  }

  async update(
    bookId: number,
    id: number,
    userId: number,
    reviewDto: UpdateReviewDto,
  ): Promise<ReviewUpdateResponseDto> {
    await this.validateReview(id, userId);

    await this.reviewRepository.update(id, {
      ...reviewDto,
    });

    return {
      averageRating: await this.getAverageRating(bookId),
    };
  }

  async getMyReviewByBookId(
    bookId: number,
    userId: number,
  ): Promise<ReviewItemDto> {
    const result = await this.reviewRepository.findOne({
      where: { bookId, userId },
    });

    return result;
  }

  private async validateReview(id: number, userId: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    } else if (review.userId !== userId) {
      throw new ForbiddenException();
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
