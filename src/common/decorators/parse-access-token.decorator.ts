import { AccessTokenPayloadDto } from '@common/dto/jwt-token.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParseAccessToken = createParamDecorator((data, ctx: ExecutionContext): AccessTokenPayloadDto => {
  const req = ctx.switchToHttp().getRequest() as Express.Request;
  return <AccessTokenPayloadDto>req.user;
});
