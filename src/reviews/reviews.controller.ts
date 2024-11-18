import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookValidationInterceptor } from './interceptors/book-validation.interceptor';

@UseInterceptors(BookValidationInterceptor)
@Controller('/books/:bookId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @Param('bookId') bookId: string,
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(+bookId, createReviewDto);
  }

  @Get()
  async findAll(@Param('bookId') bookId: string) {
    return this.reviewsService.findAll(+bookId);
  }

  @Delete(':id')
  remove(@Param('bookId') bookId: string, @Param('id') id: string) {
    return this.reviewsService.remove(+bookId, +id);
  }
}
