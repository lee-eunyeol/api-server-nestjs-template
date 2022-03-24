import { ERROR_CODE, ERROR_CODE_DESCRIPTION } from '@common/enum/error.enum';
import { HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';

export type ErrorDto = {
  errorCode: string;
  httpStatusCode: number;
  message: string;
};

export class ErrorHandler extends HttpException {
  constructor(errorCode: ERROR_CODE, httpStatusCode: HttpStatus = HttpStatus.BAD_REQUEST, message: string = null) {
    super({ errorCode, httpStatusCode, message: message ?? ERROR_CODE_DESCRIPTION[errorCode] }, httpStatusCode);
  }

  public getResponse(): ErrorDto {
    return <ErrorDto>super.getResponse();
  }
}

export class ParseIntError extends ParseIntPipe {
  exceptionFactory = (error) => {
    return new ErrorHandler(ERROR_CODE.VALIDATION_FAIL_ERROR, HttpStatus.UNPROCESSABLE_ENTITY, error);
  };
}
