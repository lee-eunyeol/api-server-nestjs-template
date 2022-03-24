import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const IpAddress = createParamDecorator((data, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  return req.header('X-FORWARDED-FOR') ?? req.ip.replace('::ffff:', '');
});
