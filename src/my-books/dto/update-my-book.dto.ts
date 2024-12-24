import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserBookDto {
  @IsString()
  @ApiProperty({ example: '책 리뷰' })
  review: string;
}
