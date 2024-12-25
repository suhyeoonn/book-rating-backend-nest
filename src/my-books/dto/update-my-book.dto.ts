import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @ApiProperty({ example: '책 리뷰' })
  review: string;
}

export class UpdateStatusDto {
  @IsString()
  @ApiProperty({ example: '상태 (0~4)' })
  status: number;
}
