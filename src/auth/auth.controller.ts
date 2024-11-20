import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Response } from 'express';
import { AuthGuard } from './security/auth.guard';
import { User } from './entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 계정 생성
   */
  @Post('/register')
  async register(@Body(new ValidationPipe()) registerDto: UserDto) {
    return this.authService.registerUser(registerDto);
  }

  /**
   * 로그인 시 JWT 토큰을 생성하고 이를 쿠키에 저장합니다. (하루동안 유효)
   */
  @Post('/login')
  async login(@Body() userDto: UserDto, @Res() res: Response) {
    const result = await this.authService.validateUser(userDto);
    res.cookie('jwt', result.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1d
    });
    return res.send(result);
  }

  /**
   * 로그아웃
   */
  @Post('/logout')
  logout(@Res() res: Response) {
    res.cookie('jwt', '', {
      maxAge: 0,
    });
    return res.send({
      message: 'success',
    });
  }

  /**
   * JWT 토큰을 검증하고 사용자 정보를 반환
   */
  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request & { user: User }) {
    return req.user;
  }
}
