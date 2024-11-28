import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsISBN, IsString } from 'class-validator';

export class CreateUserBookDto {
  @ApiProperty({ example: '9791191905236' })
  @IsISBN()
  isbn: string;

  @IsString()
  @ApiProperty({ example: '책 제목' })
  title: string;

  @IsString()
  @ApiProperty({ example: 'http://image-url' })
  thumbnail: string;

  @IsString()
  @ApiProperty({ example: '책 소개' })
  contents: string;

  @IsDateString()
  @ApiProperty({ example: '2023-10-12T15:00:00.000Z' })
  datetime: string;

  @IsString()
  @ApiProperty({
    example: '작가1, 작가2',
  })
  authors: string;

  @IsString()
  @ApiProperty({ example: '출판사' })
  publisher: string;
}

export class CreateResponseDto {
  @ApiProperty({ description: '추가된 책 id' })
  id: number;
}
