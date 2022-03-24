import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class StringResponseDto extends BaseResponseDto {
  @ApiProperty({ description: '' })
  resultData: string;

  constructor(string: string) {
    super();
    this.resultData = string;
  }
}
