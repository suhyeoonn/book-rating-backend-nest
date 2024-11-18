import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MinLength(1)
  content: string;
}

class ReviewResponseDto {
  id: number;
  content: string;
  rating: number;
  updatedAt: Date;
}

export class ReviewCreateResponseDto {
  review: ReviewResponseDto;
  averageRating: number;
}
