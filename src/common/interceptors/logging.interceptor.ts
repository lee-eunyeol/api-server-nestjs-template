import { LoggerShared } from '@shared/logger.shared';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { REQUEST_TYPE } from '@common/enum/type.enum';
//요청받은 엔드포인트에 대한 로직 수행이 언제 , 얼마나 걸렸는지 체크하고 리스폰스 로깅
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: LoggerShared = new LoggerShared();
  constructor() {
    this.logger.setContext('LoggingInterceptor');
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((responseData) => {
        this.logger.fileLog(req, REQUEST_TYPE.RESPONSE, responseData);
      })
    );
  }
}
