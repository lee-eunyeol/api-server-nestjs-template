import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [PassportModule.register({ session: true }), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
