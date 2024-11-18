import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async validateUser(userDto: UserDto): Promise<string | undefined> {
    const foundUser = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    const validatePassword = await bcrypt.compare(
      userDto.password,
      foundUser.password,
    );

    if (!foundUser || !validatePassword) {
      throw new UnauthorizedException();
    }

    return 'loginSuccess';
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // 솔트 라운드 수
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
