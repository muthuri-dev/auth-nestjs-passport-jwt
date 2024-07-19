import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtPayload } from '../access-token/access-token.strategy';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

//interface

export interface IJwtPayloadWithRefreshToken extends TJwtPayload {
  refresh_token: string;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload): IJwtPayloadWithRefreshToken {
    const refresh_token = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    // console.log('payload', payload);
    return { ...payload, refresh_token };
  }
}
