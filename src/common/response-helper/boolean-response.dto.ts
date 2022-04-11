import { ApiProperty } from '@nestjs/swagger';

export class BooleanResponseDto {
  @ApiProperty({ description: '검증에 대한 성공 , 실패 여부' })
  resultData: boolean;

  constructor(boolean: boolean) {
    this.resultData = boolean;
  }
}
