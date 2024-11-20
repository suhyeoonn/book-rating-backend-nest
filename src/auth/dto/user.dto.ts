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
  user: UserResponse;
  accessToken: string;
}

export class UserResponse {
  id: number;
  username: string;
}
