import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class RequestTeachersCompareDto {
  @IsArray()
  @ApiProperty({ isArray: true, type: [String] })
  idTeachers: string[];
}
