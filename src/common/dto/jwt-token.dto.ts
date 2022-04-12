import { JWT_TOKEN_TYPE } from '@common/enum/type.enum';

export class RefreshTokenPayloadDto {
  iss: string;
  iat: number;
  userIdx: number;
  tokenType: JWT_TOKEN_TYPE;
  uuid: string;
  exp: number;
}

export class AccessTokenPayloadDto {
  iss: string;
  iat: number;
  userIdx: number;
  tokenType: JWT_TOKEN_TYPE;
  exp: number;
}
