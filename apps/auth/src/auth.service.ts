import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '@app/prisma';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
//import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  //registering user service
  async register(registerDto: RegisterDto) {
    //check if user already exists
    const isUser = await this.prismaService.user.findUnique({
      where: { user_name: registerDto.user_name },
    });
    if (isUser) throw new BadRequestException('User already exists login');

    //hashing password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    //the tokens
    const { access_token, refresh_token } = await this.generateTokens(
      registerDto.user_name,
      registerDto.password,
    );
    const user = await this.prismaService.user.create({
      data: { ...registerDto, password: hashedPassword, refresh_token },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //const { password, ...user_without_password } = user;

    return { access_token, refresh_token, user };
  }

  //login user service
  async login() {}

  //generate tokens service
  async generateTokens(user_name: string, password: string) {
    const access_token = await this.jwtService.sign(
      {
        user_name,
        password,
      },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '1h',
      },
    );

    const refresh_token = await this.jwtService.sign(
      {
        access_token,
        user_name,
        password,
      },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );
    return { access_token, refresh_token };
  }

  //update the refresh token in the database
  async updateRefreshToken() {}
}
