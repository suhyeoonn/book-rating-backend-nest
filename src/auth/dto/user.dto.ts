import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  user: User;
  accessToken: string;
}

class User {
  id: number;
  username: string;
}
