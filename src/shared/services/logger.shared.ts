import { Injectable, LoggerService as LS, Scope } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Request } from 'express';
import * as _ from 'lodash';
import { REQUEST_TYPE } from '@common/enum/type.enum';

import { BaseResponseDto } from '@common/response-helper/base-response.dto';

const { errors, combine, json, timestamp, ms, prettyPrint } = winston.format;

const canLogging =
  (process.env.NODE_ENV === 'test' && process.env.ERR_LOGGING === 'true') ||
  (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'ci');

const isProduction = process.env.NODE_ENV === 'production';

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerShared implements LS {
  private logger: winston.Logger;
  private fileLogger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: combine(
        errors({ stack: true }),
        json(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        ms(),
        prettyPrint()
      ),
      transports: [
        new winston.transports.Console({
          level: logLevel,
          format: combine(nestWinstonModuleUtilities.format.nestLike()),
        }),
      ],
    });

    if (isProduction) {
      this.fileLogger = winston.createLogger({
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), ms(), prettyPrint()),
        transports: [
          new winston.transports.DailyRotateFile({
            level: logLevel,
            filename: '/var/log/fundgo-access-log/%DATE%-access.log',
            zippedArchive: true,
          }),
        ],
      });
    }

    console.log = (message: any, context?: any, params?: any) => {
      this.logger.debug(message, { context });
    };
  }

  setContext(context: any) {
    this.logger.transports.filter((logStream) => {
      logStream.format = combine(nestWinstonModuleUtilities.format.nestLike(context));
    });
  }

  fileLog(req: Request, type: REQUEST_TYPE, responseData?: BaseResponseDto) {
    if (!isProduction) {
      const authorization = !_.isEmpty(req.headers.authorization) ? req.headers.authorization : null;
      const query = !_.isEmpty(req.query) ? req.query : null;
      const body = !_.isEmpty(req.body) ? req.body : null;

      this.log(
        `[${type}][${req.method}${req.baseUrl}] ${JSON.stringify(
          { authorization, query, body, responseData },
          null,
          2
        )}`
      );
    } else {
      const body = !_(req.body).isEmpty() ? Object.assign({}, req.body) : '';
      if (_.has(body, 'password')) body.password = '$PWD';
      if (_.has(body, 'corporationPassword')) body.password = '$PWD';

      this.fileLogger.info(
        JSON.parse(
          JSON.stringify({
            type,
            ip: req.header('X-FORWARDED-FOR') ?? req.ip.replace('::ffff:', ''),
            method: req.method,
            url: req.baseUrl,
            query: !_(req.query).isEmpty() ? req.query : '',
            body,
            user: req.user ?? '',
            token: req.headers.authorization ?? '',
            userAgent: req.headers['user-agent'] ?? '',
            referer: req.headers['referer'] ?? '',
            contentLength: req.headers['content-length'] ?? '',
            responseData: responseData ?? '',
          })
        )
      );
    }
  }

  log(message: string) {
    if (!canLogging) return;
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    if (!canLogging) return;
    this.logger.error(message, trace);
  }

  warn(message: string) {
    if (!canLogging) return;
    this.logger.warn(message);
  }

  debug(message: string) {
    if (!canLogging) return;
    this.logger.debug(message);
  }

  verbose(message: string) {
    if (!canLogging) return;
    this.logger.verbose(message);
  }
}
