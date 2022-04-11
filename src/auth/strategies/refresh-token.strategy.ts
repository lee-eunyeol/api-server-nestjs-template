import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigShared } from '@shared/config.shared';
// import { jwtConstants } from './constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigShared) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.JWT.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    try {
      const refreshToken = req.body.refreshToken;
      return { payload, refreshToken };
    } catch (error) {
      throw new UnauthorizedException(`refreshToken이없거나 잘못되었습니다.${error.stack}`);
    }
  }
}
