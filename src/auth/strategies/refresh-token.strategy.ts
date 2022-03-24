import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpStatus } from '@nestjs/common';
import { ErrorHandler } from '@common/filters/error-handler';
import { Request } from 'express';
import { ConfigShared } from '@shared/config.shared';
import { ERROR_CODE } from '@common/enum/error.enum';
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
      throw new ErrorHandler(ERROR_CODE.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, '리프레시 토큰이 없습니다.');
    }
  }
}
