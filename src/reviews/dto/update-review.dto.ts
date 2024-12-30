import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { ReviewDeleteResponseDto } from './delete-review.dto';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
export class ReviewUpdateResponseDto extends ReviewDeleteResponseDto {}

export class UpdateRatingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({ example: '별점 (1~5)' })
  rating: number;
}
