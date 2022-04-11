import { BadRequestException, Controller, Get } from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/http-exception')
  httpExceptionTest(): string {
    throw new BadRequestException('httpExceptionTest 에러테스트!');
  }

  @Get('/typeorm-exception')
  typeOrmExceptionTest(): string {
    throw new TypeORMError('typeOrmExceptionTest 에러 테스트!');
  }

  @Get('/server-error')
  serverErrorTest(): string {
    const a = undefined;
    a.asd = 1;
    return '1';
  }
}
