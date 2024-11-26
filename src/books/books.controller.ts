import { Controller, Get, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * 책 목록 조회
   */
  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  /**
   * 책 조회
   */
  @Get(':id')
  async find(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  /**
   * 책 삭제
   */
  // TODO: 사용자 인증
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
