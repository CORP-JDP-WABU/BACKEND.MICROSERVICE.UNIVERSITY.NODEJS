import { ApiProperty } from '@nestjs/swagger';

class TeacherDto {
  @ApiProperty()
  idTeacher: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  photoUrl: string;
}

class CourseDto {
  @ApiProperty()
  idCourse: string;

  @ApiProperty()
  name: string;
}

export class ResponseCareerTeacherCourseDto {
  @ApiProperty({ type: TeacherDto, isArray: false })
  idTeacher: TeacherDto;

  @ApiProperty({ type: CourseDto, isArray: false })
  idCourse: CourseDto;
}
