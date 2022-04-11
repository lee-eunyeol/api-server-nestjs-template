import { ApiProperty } from '@nestjs/swagger';

export class IdxResponseDto {
  @ApiProperty()
  resultData: number;

  constructor(idx: number) {
    this.resultData = idx;
  }
}
