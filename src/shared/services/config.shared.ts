import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

//환경변수를 관리하기 위한 서비스
@Injectable()
export class ConfigShared {
  constructor(private configService: ConfigService) {}

  SERVER_STATUS = this.getString('NODE_ENV');

  APP = {
    PORT: this.getString('PORT'),
  };

  SESSION = {
    SECRET_KEY: this.getString('SESSION_SECRET_KEY'),
  };

  JWT = {
    ACCESS_TOKEN_SECRET: this.getString('JWT_SECRET'),
    REFRESH_TOKEN_SECRET: this.getString('JWT_SECRET_REFRESH'),
    ACCESS_TOKEN_EXPIRE_DATE: this.getString('JWT_ACCESS_TOKEN_EXPIRE_DATE'),
    REFRESH_TOKEN_EXPIRE_DATE: this.getString('JWT_REFRESH_TOKEN_EXPIRE_DATE'),
    JWT_ISS: this.getString('JWT_ISS'),
  };

  private getNumber(key: string): number {
    const value = this.get(key);
    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }
  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);
    if (!value) return '';

    return value.replace(/\\n/g, '\n');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) return '';

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }
}
