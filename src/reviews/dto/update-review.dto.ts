import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { ReviewDeleteResponseDto } from './delete-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
export class ReviewUpdateResponseDto extends ReviewDeleteResponseDto {}
