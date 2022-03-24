import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class IdxResponseDto extends BaseResponseDto {
  @ApiProperty()
  resultData: number;

  constructor(idx: number) {
    super();
    this.resultData = idx;
  }
}
