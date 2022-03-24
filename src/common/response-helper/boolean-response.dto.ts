import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class BooleanResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '검증에 대한 성공 , 실패 여부' })
  resultData: boolean;

  constructor(boolean: boolean) {
    super();
    this.resultData = boolean;
  }
}
