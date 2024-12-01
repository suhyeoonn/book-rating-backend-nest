import { ApiProperty } from '@nestjs/swagger';

export class GetMyBooks {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5, description: '1 ~ 5' })
  rating: number;

  @ApiProperty({
    example: 1,
    description: '0: ready, 1: reading, 2: stopped, 3: finished',
  })
  status: number;

  @ApiProperty({ example: '2024-11-29T12:08:02.000Z', description: '추가일' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-11-29T12:08:02.000Z',
    description: '마지막 수정일',
  })
  updatedAt: Date;

  @ApiProperty({ example: null, description: '완료일' })
  finishedAt: Date;

  book: Book;
}

class Book {
  @ApiProperty({ example: '1' })
  id: number;

  @ApiProperty({ example: '개발자 원칙' })
  title: string;
}
