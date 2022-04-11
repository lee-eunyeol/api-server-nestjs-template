import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class AccessGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, context) {
    if (err || !user) {
      const error = info as Error;
      throw new UnauthorizedException(`accessToken이없거나 잘못되었습니다.${error.stack}`);
    }

    return user;
  }
}
