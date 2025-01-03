import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResponseDto, UserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(newUser: UserDto): Promise<{ message: string }> {
    const foundUser = await this.userRepository.findOne({
      where: { username: newUser.username },
    });
    if (foundUser) {
      throw new BadRequestException('Username already exists.');
    }

    await this.userRepository.save({
      username: newUser.username,
      password: await this.hashPassword(newUser.password),
    });

    return { message: 'User registered successfully.' };
  }

  async validateUser(userDto: UserDto): Promise<LoginResponseDto | undefined> {
    const foundUser = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!foundUser) throw new UnauthorizedException();

    const validatePassword = await bcrypt.compare(
      userDto.password,
      foundUser.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: foundUser.id, username: foundUser.username };

    return { user: payload, accessToken: this.jwtService.sign(payload) };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // 솔트 라운드 수
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async tokenValidateUser(payload: Payload): Promise<Payload> {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
    };
  }
}
