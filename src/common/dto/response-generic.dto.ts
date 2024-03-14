import { ApiProperty } from '@nestjs/swagger';
import * as universityDto from 'src/modules/university/dto';
import * as teacherDto from 'src/modules/teacher/dto';
import * as courseDto from 'src/modules/course/dto';

export class ResponseGenericDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  operation: string;

  @ApiProperty()
  data:
    | universityDto.ResponseUniversityDto[]
    | teacherDto.ResponseCareerTeacherCourseDto[]
    | courseDto.ResponseProfileCourseDto
    | any;
}
