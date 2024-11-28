import { OmitType } from '@nestjs/mapped-types';
import { UserBook } from '../entities/user-book.entity';

export class GetMyBooks extends OmitType(UserBook, ['book'] as const) {}
