import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Req,
  Query,
} from '@nestjs/common';
import { UserBooksService } from './my-books.service';
import { CreateUserBookDto } from './dto/create-my-book.dto';
import { UpdateReviewDto, UpdateStatusDto } from './dto/update-my-book.dto';
import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller('my-books')
@ApiCookieAuth()
export class MyBooksController {
  constructor(private readonly userBooksService: UserBooksService) {}

  /**
   * 책 등록
   */
  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe()) createUserBookDto: CreateUserBookDto,
    @Req() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return this.userBooksService.create(createUserBookDto, userId);
  }

  /**
   * 책 목록 조회
   */
  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request & { user: User }) {
    const userId = req.user.id;
    return this.userBooksService.findAll(userId);
  }

  /**
   * 책이 내 리스트에 등록되어 있는지 확인
   */
  @Get('exists')
  @UseGuards(AuthGuard)
  isBookInMyList(
    @Query('isbn') isbn: string,
    @Req() req: Request & { user: User },
  ) {
    const userId = req.user.id;
    return this.userBooksService.isBookInMyList(isbn, userId);
  }

  /**
   * 단일 책 상세 조회
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBooksService.findOne(+id);
  }

  /**
   * 리뷰 수정
   */
  @Patch(':id/review')
  reviewUpdate(
    @Param('id') id: string,
    @Body() updateUserBookDto: UpdateReviewDto,
  ) {
    return this.userBooksService.updateReview(+id, updateUserBookDto);
  }

  /**
   * 상태 수정
   */
  @Patch(':id/status')
  statusUpdate(@Param('id') id: string, @Body() updateDto: UpdateStatusDto) {
    return this.userBooksService.updateStatus(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBooksService.remove(+id);
  }
}
