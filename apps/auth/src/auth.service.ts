import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '@app/prisma';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Logout } from './entities/auth.entity';

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

    const user = await this.prismaService.user.create({
      data: { ...registerDto, password: hashedPassword },
    });

    //the tokens
    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.user_name,
    );

    await this.updateRefreshToken(user.id, refresh_token);

    return await { access_token, refresh_token, user };
  }

  //login user service
  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { user_name: loginDto.user_name },
    });
    if (!user)
      throw new ForbiddenException('No account registered with the username');

    //copmare passwords
    const isPassMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isPassMatch) throw new ForbiddenException('Incorrect password');

    //creating new token
    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.user_name,
    );

    //update refresh token
    await this.updateRefreshToken(user.id, refresh_token);

    return await { access_token, refresh_token, user };
  }

  //user log out service
  async logout(user_id: string): Promise<Logout> {
    await this.prismaService.user.updateMany({
      where: { id: user_id, refresh_token: { not: null } },
      data: { refresh_token: null },
    });
    return await { loggedout: 'loggedout successfully' };
  }

  //generating new tokens after expiry
  async getNewTokens(user_id: string, rt: string) {
    //checking if user exists
    const user = await this.prismaService.user.findUnique({
      where: { id: user_id },
    });
    if (!user)
      throw new BadRequestException('Access Denied user does not exist!!');

    //checking if refresh tokens match with the one in the database
    const isRefreshTokenMatch = await bcrypt.compare(rt, user.refresh_token);

    if (!isRefreshTokenMatch)
      throw new ForbiddenException('Access Denied invalid token provided !!');

    //creating new token if token is correct
    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.user_name,
    );

    //update refresh_token
    await this.updateRefreshToken(user.id, refresh_token);

    return await { access_token, refresh_token, user };
  }

  //generate tokens service
  async generateTokens(user_id: string, user_name: string) {
    const access_token = await this.jwtService.sign(
      {
        user_name,
        user_id,
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
        user_id,
      },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );
    return await { access_token, refresh_token };
  }

  //update the refresh token in the database
  async updateRefreshToken(user_id: string, refresh_token: string) {
    //checking if user exists
    const user = await this.prismaService.user.findUnique({
      where: { id: user_id },
    });
    if (!user) throw new BadRequestException('User does not exist!');

    // hashing refresh token
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

    await this.prismaService.user.update({
      where: { id: user_id },
      data: { refresh_token: hashedRefreshToken },
    });
  }
}
