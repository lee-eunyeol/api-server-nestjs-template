export class RefreshTokenCertificateResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    Object.assign(this, { accessToken, refreshToken });
  }
}
