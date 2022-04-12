import { JWT_TOKEN_TYPE } from '@common/enum/type.enum';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigShared } from '@shared/config.shared';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  constructor(private config: ConfigShared, private jwtService: JwtService) {}

  async generateAccessToken(user: any): Promise<string> {
    return await this.jwtService.signAsync(
      {
        iat: Math.ceil(new Date().getTime() / 1000),
        userIdx: user.userIdx,
        tokenType: JWT_TOKEN_TYPE.ACCESS_TOKEN,
      },
      {
        issuer: this.config.JWT.JWT_ISS,
        secret: this.config.JWT.ACCESS_TOKEN_SECRET,
        expiresIn: this.config.JWT.ACCESS_TOKEN_EXPIRE_DATE,
      }
    );
  }

  async generateRefreshToken(user: any, uuid: string, ip: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        iat: Math.ceil(new Date().getTime() / 1000),
        userIdx: user.userIdx,
        tokenType: JWT_TOKEN_TYPE.REFRESH_TOKEN,
        uuid,
      },
      {
        issuer: this.config.JWT.JWT_ISS,
        secret: this.config.JWT.REFRESH_TOKEN_SECRET,
        expiresIn: this.config.JWT.REFRESH_TOKEN_EXPIRE_DATE,
      }
    );
    // await this.userRepository.update(user.userIdx, {
    //   currentLoginIp: ip,
    //   currentLoginAt: new Date(),
    //   latestLoginIp: user.currentLoginIp,
    //   latestLoginAt: user.currentLoginAt,
    // });

    // return refreshToken;
  }

  /**
   * 실패 사례
   * case 1 : 리프레시토큰 추가검증이 실패했을경우  = UNAUTHORIZED
   * case 2: 받은refreshToken이 디비에 저장되있는게 매치되는게 없을경우  = UNAUTHORIZED
   * -> 클라이언트에서 로그인페이지로 이동한 후 다시 로그인 할 수 있도록 처리
   *
   * 성공사례
   * case 3: 받은 refreshToken이 디비에 저장되있는게 있을 경우
   * -> 로그인 디바이스 테이블에 정보를 update
   * case 4: case 2 와 동일하지만 리프레시 토큰의 유효기간이 얼마 남지 않아 재발급 해주어야 하는경우
   * -> 로그인 디바이스 테이블에 정보를 insert
   */
  // async checkRefreshToken(
  //   refreshTokenData: RefreshTokenData,
  //   userLoginDeviceReqDto: UserLoginDeviceReqDto,
  //   userIp: string
  // ): Promise<TokenDataResponseDto> {
  //   const { iss, tokenType } = refreshTokenData.payload;

  //   if (tokenType !== JWT_TOKEN_TYPE.REFRESH_TOKEN) {
  //     throw new ErrorHandler(ERROR_CODE.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, '토큰이 유효하지 않습니다.[tokenType]');
  //   }

  //   if (iss !== this.config.JWT.JWT_ISS)
  //     throw new ErrorHandler(
  //       ERROR_CODE.UNAUTHORIZED,
  //       HttpStatus.UNAUTHORIZED,
  //       '리프레시 토큰이 유효하지 않습니다.[iss]'
  //     );

  // const userInfo = await this.userRepository.findOne(refreshTokenData.payload.userIdx);
  // if (!userInfo) throw new ErrorHandler(ERROR_CODE.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, '사용자 정보가 없습니다.');

  // const userLoginDeviceInfo = await this.userLoginDeviceRepository.findOne({
  //   refreshTokenUuid: refreshTokenData.payload.uuid,
  // });
  // if (!userLoginDeviceInfo) {
  //   throw new ErrorHandler(ERROR_CODE.UNAUTHORIZED, HttpStatus.UNAUTHORIZED, 'DB에 리프레시토큰과 관련된 uuid 없음');
  // }

  // await this.userLoginDeviceRepository.update(userLoginDeviceInfo.userLoginDeviceIdx, {
  //   fcmDeviceToken: userLoginDeviceReqDto.fcmDeviceToken,
  //   deviceType: userLoginDeviceReqDto.deviceType,
  //   userDeviceId: userLoginDeviceReqDto.userDeviceId,
  //   refreshTokenUuid: refreshTokenData.payload.uuid,
  //   userIdx: refreshTokenData.payload.userIdx,
  //   createIp: userIp,
  //   updatedAt: new Date(),
  // });

  //   return new TokenDataResponseDto(await this.getTokens(userInfo, refreshTokenData.payload.uuid, userIp));
  // }

  async generateTokens(user: any, uuid: string, ip: string): Promise<TokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user, uuid, ip),
    ]);
    return { accessToken, refreshToken };
  }
}
