import { ApiProperty } from '@nestjs/swagger';
import * as universityDto from 'src/modules/university/dto';

export class ResponseGenericDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  operation: string;

  @ApiProperty()
  data: universityDto.ResponseUniversityDto[];
}
