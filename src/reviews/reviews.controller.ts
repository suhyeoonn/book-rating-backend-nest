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
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
// import { BookValidationInterceptor } from './interceptors/book-validation.interceptor';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { Request } from 'express';
import { User } from 'src/auth/entity/user.entity';
import { UpdateRatingDto, UpdateCommentDto } from './dto/update-review.dto';
import { ApiBody, ApiCookieAuth, ApiResponse } from '@nestjs/swagger';
import { ReviewValidationInterceptor } from './interceptors/review-validation.interceptor';

@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Book not found.',
})
// @UseInterceptors(BookValidationInterceptor) //TODO: 제거?
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  /**
   * 책 리뷰 목록 조회
   */
  @Get()
  async findAll(@Query('bookId') bookId: string) {
    return this.reviewsService.findAll(+bookId);
  }

  /**
   * 책 리뷰 단일 조회
   */
  @Get(':id')
  async find(@Param('id') id: string) {
    return this.reviewsService.find(+id);
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
   * 별점 수정
   */
  @Patch(':id/rating')
  ratingUpdate(@Param('id') id: string, @Body() updateDto: UpdateRatingDto) {
    return this.reviewsService.updateRating(+id, updateDto);
  }

  /**
   * 한줄평 수정
   */
  @Patch(':id/comment')
  @ApiCookieAuth()
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found.',
  })
  @ApiBody({ type: UpdateCommentDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(ReviewValidationInterceptor)
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) reviewDto: UpdateCommentDto,
  ) {
    return this.reviewsService.updateComment(+id, reviewDto);
  }

  /**
   * 책 리뷰 삭제
   */
  @Delete(':id')
  @ApiCookieAuth()
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Book or Review not found.',
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(ReviewValidationInterceptor)
  remove(@Param('bookId') bookId: string, @Param('id') id: string) {
    return this.reviewsService.remove(+bookId, +id);
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
