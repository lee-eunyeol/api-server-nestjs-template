import { LoggerShared } from '@shared/logger.shared';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { ERROR_CODE } from '@common/enum/error.enum';
import { BaseResponseDto } from '@common/response-helper/base-response.dto';
import { ErrorHandler } from './error-handler';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { sendErrorWebHook } from './slack-webhook';
import { REQUEST_TYPE } from '@common/enum/type.enum';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private logger: LoggerShared) {
    this.logger.setContext('ExceptionsFilter');
  }

  catch(exception: any, host: ArgumentsHost) {
    const responseData: BaseResponseDto = new BaseResponseDto();
    responseData.result = false;
    responseData.resultData = null;

    if (exception instanceof ErrorHandler) {
      const res = exception.getResponse();
      responseData.errorCode = res.errorCode;
      responseData.errorMessage = res.message;

      this.logger.error(`[ERROR][${res.httpStatusCode}][${res.errorCode}] ${res.message} `, exception.stack);

      this.sendResponse(host, res.httpStatusCode, responseData, true);
    } else if (exception instanceof TypeORMError) {
      responseData.errorCode = ERROR_CODE.QUERY_ERROR;
      responseData.errorMessage = `MESSAGE :${exception.toString()}\nTRACE : ${exception.stack}`;
      if (exception instanceof QueryFailedError) {
        responseData.errorMessage += `\n----------------------------------------------------------------------------------------
${exception.query}
----------------------------------------------------------------------------------------
[${exception.parameters}]
----------------------------------------------------------------------------------------`;
      }

      this.logger.error(`[TYPEORM_ERROR] ${responseData.errorMessage}`, exception.stack);

      sendErrorWebHook({ ...responseData, resultData: '[TYPEORM_ERROR]' });

      this.sendResponse(host, HttpStatus.BAD_REQUEST, responseData);
    } else if (exception instanceof NotFoundException) {
      responseData.errorCode = ERROR_CODE.NOT_FOUND_PATH;
      responseData.errorMessage = `MESSAGE : ${ERROR_CODE.NOT_FOUND_PATH} \n TRACE : ${exception.stack}`;

      this.logger.error(`[NOT_FOUND_PATH_ERROR] ${responseData.errorMessage}`, exception.stack);

      this.sendResponse(host, HttpStatus.NOT_FOUND, responseData);
    } else {
      responseData.errorCode = ERROR_CODE.SERVER_ERROR;
      responseData.errorMessage = `MESSAGE :${exception}\nTRACE : ${exception.stack}`;

      this.logger.error(`[INTERNAL_SERVER_ERROR] ${exception}`, exception.stack);
      if (typeof exception === 'object') {
        console.dir(exception);
      }

      sendErrorWebHook({ ...responseData, resultData: '[INTERNAL_SERVER_ERROR]' });

      this.sendResponse(host, HttpStatus.INTERNAL_SERVER_ERROR, responseData);
    }
  }

  sendResponse(host: ArgumentsHost, httpStatusCode: HttpStatus, responseData: BaseResponseDto, sendLog = false) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (process.env.NODE_ENV === 'production') {
      if (!sendLog) responseData.errorMessage = '';
      this.logger.fileLog(request, REQUEST_TYPE.RESPONSE, responseData);
    }
    response.status(httpStatusCode).json(responseData);
  }
}
