import { RefreshTokenPayloadDto } from '@common/dto/jwt-token.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParseRefreshToken = createParamDecorator((data, ctx: ExecutionContext): RefreshTokenPayloadDto => {
  const req = ctx.switchToHttp().getRequest() as Express.Request;
  return <RefreshTokenPayloadDto>req.user;
});
