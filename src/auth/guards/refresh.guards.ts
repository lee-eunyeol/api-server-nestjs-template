import { ERROR_CODE } from '@common/enum/error.enum';
import { ErrorHandler } from '@common/filters/error-handler';
import { AuthGuard } from '@nestjs/passport';

export class RefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
  handleRequest(err, user, info, status) {
    if (err || !user) {
      const error = info as Error;
      throw new ErrorHandler(ERROR_CODE.UNAUTHORIZED, 401, `${error.stack}`);
    }
    return user;
  }
}
