import { PartialType } from '@nestjs/swagger';
import { CreateUserBookDto } from './create-my-book.dto';

export class UpdateUserBookDto extends PartialType(CreateUserBookDto) {}
