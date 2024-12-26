import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @ApiProperty({ example: '책 리뷰' })
  review: string;
}

export class UpdateStatusDto {
  @IsNumber()
  @ApiProperty({ example: '상태 (0~4)' })
  status: number;
}

export class UpdateRatingDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({ example: '별점 (1~5)' })
  rating: number;
}
