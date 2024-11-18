import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body(new ValidationPipe()) registerDto: UserDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('/login')
  async login(@Body() userDto: UserDto) {
    return await this.authService.validateUser(userDto);
  }
}
