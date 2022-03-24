import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({
    description: '요청에대한 성공 여부',
    examples: [true, false],
    example: true,
  })
  result: boolean;

  @ApiProperty({ description: '에러 내용', example: '' })
  errorMessage: string;

  @ApiProperty({
    example: '',
    description: '에러코드 (에러에대한 세부분기 처리할때 이용)',
  })
  errorCode: string;

  resultData: any;

  constructor() {
    this.result = true;
    this.errorCode = '';
    this.errorMessage = '';
    this.resultData = null;
  }
}
