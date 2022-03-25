import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ErrorHandler } from '@common/filters/error-handler';
import { ERROR_CODE } from './common/enum/error.enum';
import { sendErrorWebHook } from '@common/filters/slack-webhook';
import { BaseResponseDto } from '@common/response-helper/base-response.dto';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { SharedModule } from './shared/shared.module';
import { ConfigShared } from './shared/services/config.shared';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupPm2(app);
  setupSeverEnvironment(app);
  setupValidationPipe(app);
  setupInterceptor(app);
  setupSwagger(app);
  handleUnexpectedError();
  await startServer(app);
}

const setupSeverEnvironment = (app: NestExpressApplication) => {
  app.setGlobalPrefix('api');
  //프록시 이용했을때
  app.enable('trust proxy');

  //http 해더 보안취약점 보호
  app.use(helmet());
  //CORS활성화
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  /*
   * 참고 이 옵션이 로 설정되어 true있지만 saveUninitialized옵션이 로 설정 false되어 있으면 초기화되지 않은 세션이 있는 응답에 쿠키가 설정되지 않습니다.
   * 이 옵션은 요청에 대해 기존 세션이 로드된 경우에만 동작을 수정합니다.
   */

  // const redisClient = createClient({ url: config.REDIS.URL, legacyMode: true });
  // redisClient.connect().catch((error: Error) => console.error(error));
  const config = app.select(SharedModule).get(ConfigShared);
  const sessionOption: session.SessionOptions = {
    // store: new (RedisStore(session))({
    //   client: redisClient,
    //   logErrors: true,
    // }),
    resave: false,
    saveUninitialized: true,
    secret: config.SESSION.SECRET_KEY,
    rolling: true, //새로고침이나 페이지 이동같이 다른 api를 새로 호출하면 기존의 세션만료시간을 갱신
    cookie: { maxAge: 12 * 60 * 60 * 1000, httpOnly: true }, //세션 12시간 //secure : true -> 프로덕션시 붙이기 -> https환경에서만 세션을 사용할 수 있도록 허용
  };

  app.use(session(sessionOption));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
};

const setupValidationPipe = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      // dismissDefaultMessages: true,//TODO 프로덕션 환경때에는 에러 메시지 안보이게 할지 고민하기
      exceptionFactory: (errors) => {
        return new ErrorHandler(
          ERROR_CODE.VALIDATION_FAIL_ERROR,
          HttpStatus.UNPROCESSABLE_ENTITY,
          JSON.stringify(errors).replace(/\\/gi, '')
        );
      },
    })
  );
};

const handleUnexpectedError = () => {
  process
    .on('unhandledRejection', (reason: Error) => {
      const responseData: BaseResponseDto = new BaseResponseDto();
      responseData.result = false;
      responseData.resultData = 'unhandledRejection';
      responseData.errorCode = ERROR_CODE.SERVER_ERROR;
      responseData.errorMessage = `[Unhandled Rejection at Promise]! ${reason.name} : ${reason.message}`;
      console.error(`[Unhandled Rejection at Promise]! ${reason.name} : ${reason.message}`, reason.stack);

      sendErrorWebHook(responseData);
    })
    .on('uncaughtException', (error: Error) => {
      const responseData: BaseResponseDto = new BaseResponseDto();
      responseData.result = false;
      responseData.resultData = error.message;
      responseData.errorCode = ERROR_CODE.SERVER_ERROR;
      responseData.errorMessage = `[uncaughtException]!$ ${error.name} : ${error.message}`;

      console.error(`[uncaughtException]!$ ${error.name} : ${error.message}`, error.stack);

      sendErrorWebHook(responseData);
    });
};

const setupInterceptor = (app: NestExpressApplication) => {
  app.useGlobalInterceptors(new LoggingInterceptor());
};

const setupPm2 = (app: NestExpressApplication) => {
  //https://engineering.linecorp.com/ko/blog/pm2-nodejs/
  let isDisableKeepAlive = false;
  app.use(function (req, res, next) {
    if (isDisableKeepAlive) res.set('Connection', 'close');
    next();
  });
  process.on('SIGINT', async () => {
    isDisableKeepAlive = true;
    await app.close();
    console.info('[SIGINT] 서버 종료');
    process.exit(0);
  });
};

const startServer = async (app: NestExpressApplication) => {
  const config = app.select(SharedModule).get(ConfigShared);

  await app.listen(config.APP.PORT);
  if (process.send) {
    console.info('[Process Ready] to pm2');
    process.send('ready');
  }
};

bootstrap();
