import { IsISBN, IsString } from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  isbn: string;

  @IsString()
  title: string;

  @IsString()
  thumbnail: string;
}
