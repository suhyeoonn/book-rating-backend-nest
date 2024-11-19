import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ReviewDeleteResponseDto } from './delete-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
export class ReviewUpdateResponseDto extends ReviewDeleteResponseDto {}
