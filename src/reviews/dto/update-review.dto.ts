import { ApiProperty } from '@nestjs/swagger';
import { ReviewDeleteResponseDto } from './delete-review.dto';
import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  content: string;
}
export class ReviewUpdateResponseDto extends ReviewDeleteResponseDto {}

export class UpdateRatingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({ example: '별점 (1~5)' })
  rating: number;
}
