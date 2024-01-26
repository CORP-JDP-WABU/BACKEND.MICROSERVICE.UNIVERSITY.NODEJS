import { ApiProperty } from '@nestjs/swagger';

export class RequestSuggestUniversityDto {
  @ApiProperty()
  university: string;
}
