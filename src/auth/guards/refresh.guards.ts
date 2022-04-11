import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class RefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, status) {
    if (err || !user) {
      const error = info as Error;
      throw new UnauthorizedException(`refreshToken이없거나 잘못되었습니다.${error.stack}`);
    }
    return user;
  }
}
