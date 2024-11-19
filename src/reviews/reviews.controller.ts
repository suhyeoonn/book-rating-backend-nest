import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookValidationInterceptor } from './interceptors/book-validation.interceptor';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { User } from 'src/auth/entity/user.entity';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiCookieAuth } from '@nestjs/swagger';

@UseInterceptors(BookValidationInterceptor)
@Controller('/books/:bookId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * 책 리뷰 목록 조회
   */
  @Get()
  async findAll(@Param('bookId') bookId: string) {
    return this.reviewsService.findAll(+bookId);
  }

  /**
   * 책 리뷰 등록
   */
  @Post()
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  create(
    @Param('bookId') bookId: string,
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
    @Req() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return this.reviewsService.create(+bookId, createReviewDto, userId);
  }

  /**
   * 책 리뷰 수정
   */
  @Patch(':id')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  update(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: User },
    @Body(new ValidationPipe()) reviewDto: UpdateReviewDto,
  ) {
    const userId = req.user.id;
    return this.reviewsService.update(+bookId, +id, userId, reviewDto);
  }

  /**
   * 책 리뷰 삭제
   */
  @Delete(':id')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  remove(
    @Param('bookId') bookId: string,
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return this.reviewsService.remove(+bookId, +id, userId);
  }

  /**
   * 로그인한 사용자의 리뷰 조회
   */
  @Get('/my-review')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  async hasUserReview(
    @Param('bookId') bookId: string,
    @Req() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return await this.reviewsService.getMyReviewByBookId(+bookId, +userId);
  }
}
