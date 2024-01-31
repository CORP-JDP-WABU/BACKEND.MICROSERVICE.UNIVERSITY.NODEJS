import { ApiProperty } from "@nestjs/swagger";

export class ResponseCareerTeacherCourseDto {
    @ApiProperty()
    idTeacher: string;

    @ApiProperty()
    teacherFirstName: string;

    @ApiProperty()
    teacherLastName: string;
    
    @ApiProperty()
    teacherPhotoUrl: string;

    @ApiProperty()
    idCourse: string;

    @ApiProperty()
    courseName: string;

}