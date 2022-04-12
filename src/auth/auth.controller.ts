import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { RefreshGuard } from './guards/refresh.guards';
import { IpAddress } from '@common/decorators/ip-address.decorator';
import { v4 } from 'uuid';
import { AccessGuard } from './guards/access.guards';
import { RefreshTokenCertificateRequestDto } from './dto/refresh-token-certificate-request.dto';

@ApiTags('회원 - 인증')
@Controller('auth')
export class AuthController {
  constructor(private tokenService: TokenService) {}

  @ApiOperation({ summary: '[테스트]리프레시 토큰 검증' })
  @Post('test/certificate-refresh-token')
  @UseGuards(RefreshGuard)
  async certificateRefreshToken(@Body() reqDto: RefreshTokenCertificateRequestDto): Promise<string> {
    return 'ok';
  }

  @ApiOperation({ summary: '[테스트]어세스 토큰 검증' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Get('test/certificate-access-token')
  async certificateAccessToken(): Promise<string> {
    return 'ok';
  }

  @ApiOperation({ summary: '[테스트]어세스 토큰 생성' })
  @Get('test/access-token')
  async generateAccessToken(): Promise<string> {
    return this.tokenService.generateAccessToken({ userIdx: 1 });
  }

  @ApiOperation({ summary: '[테스트]리프레시 토큰 생성' })
  @Get('test/refresh-token')
  async generateRefreshToken(@IpAddress() ip: string): Promise<string> {
    return this.tokenService.generateRefreshToken({ userIdx: 1 }, v4(), ip);
  }
}
