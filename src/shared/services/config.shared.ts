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
