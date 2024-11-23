import { IsDateString, IsISBN, IsString } from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  isbn: string;

  @IsString()
  title: string;

  @IsString()
  thumbnail: string;

  @IsString()
  contents: string;

  @IsDateString()
  datetime: string;

  @IsString()
  authors: string;

  @IsString()
  publisher: string;
}
