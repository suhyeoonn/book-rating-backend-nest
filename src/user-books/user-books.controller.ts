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
import { UserBooksService } from './user-books.service';
import { CreateUserBookDto } from './dto/create-user-book.dto';
import { UpdateUserBookDto } from './dto/update-user-book.dto';
import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from 'src/auth/security/auth.guard';

@Controller('user-books')
export class UserBooksController {
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

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request & { user: User }) {
    const userId = req.user.id;
    return this.userBooksService.findAll(userId);
  }

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
