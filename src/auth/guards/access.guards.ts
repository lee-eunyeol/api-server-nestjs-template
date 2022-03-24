import { ERROR_CODE } from '@common/enum/error.enum';
import { ErrorHandler } from '@common/filters/error-handler';
import { AuthGuard } from '@nestjs/passport';

export class AccessGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, context) {
    if (err || !user) {
      const error = info as Error;
      throw new ErrorHandler(ERROR_CODE.UNAUTHORIZED, 401, `${error.stack}`);
    }

    return user;
  }
}
