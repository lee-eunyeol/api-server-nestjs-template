
# Nest JS api 템플릿
## Install

```bash
$ npm install
```

## env 파일 세팅
```bash
# .env.development , .env.production , .env.test 세 파일 생성 
#-> 상황에 따라 아래 환경변수 수정하기
PORT=3000
REDIS_URL=redis://default:@localhost:6379
JWT_SECRET_ACCESS=access_token
JWT_SECRET_REFRESH=refresh_token
JWT_ACCESS_TOKEN_EXPIRE_DATE=30m
JWT_REFRESH_TOKEN_EXPIRE_DATE=60m
JWT_ISS=https://test-jwt.com

```
## 시작

```bash
# development
$ npm run start:dev

# production
$ npm run start:prod
```

## Test

```bash
# e2e 테스트
$ npm run test:e2e

# unit 테스트
$ npm run test:unit

# CI/CD 환경에서의 테스트
$ npm run test:ci
```

