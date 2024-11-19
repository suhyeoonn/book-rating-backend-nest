import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body(new ValidationPipe()) registerDto: UserDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('/login')
  async login(@Body() userDto: UserDto, @Res() res: Response) {
    const result = await this.authService.validateUser(userDto);
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1d
    });
    return res.send(result);
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    return res.send({
      message: 'success',
    });
  }
}
