import { REQUEST_TYPE } from '@common/enum/type.enum';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerShared } from '@shared/logger.shared';
//들어오는 모든 리퀘스트를 로깅하기 위해 사용
@Injectable()
export class PathLoggerMiddleware implements NestMiddleware {
  constructor(private logger: LoggerShared) {
    this.logger.setContext('PathLoggerMiddleware');
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.fileLog(req, REQUEST_TYPE.REQUEST);
    next();
  }
}
