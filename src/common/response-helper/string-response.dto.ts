import { ApiProperty } from '@nestjs/swagger';

export class StringResponseDto {
  @ApiProperty({ description: '' })
  resultData: string;

  constructor(string: string) {
    this.resultData = string;
  }
}
