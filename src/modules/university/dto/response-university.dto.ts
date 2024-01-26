import { ApiProperty } from '@nestjs/swagger';

class Career {
  @ApiProperty()
  idCareer: string;

  @ApiProperty()
  name: string;
}

export class ResponseUniversityDto {
  @ApiProperty()
  idUniversity: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [Career], isArray: true })
  careers: Career[];
}
