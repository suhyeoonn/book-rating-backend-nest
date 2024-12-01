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
} from '@nestjs/common';
import { UserBooksService } from './my-books.service';
import { CreateUserBookDto } from './dto/create-my-book.dto';
import { UpdateUserBookDto } from './dto/update-my-book.dto';
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
   * 단일 책 상세 조회
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBooksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserBookDto: UpdateUserBookDto,
  ) {
    return this.userBooksService.update(+id, updateUserBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBooksService.remove(+id);
  }
}
