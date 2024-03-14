import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

class Teachers {

}

class Docs {
    @ApiProperty()
    exams: number;

    @ApiProperty()
    summaries: number;
}

export class ResponseProfileCourseDto {
  
    @ApiProperty()
    idCourse: string;

    @ApiProperty()
    course: string;

    @ApiProperty()
    averageQualification: number;

    @ApiProperty()
    quantityComment: number;
    
    @ApiProperty({ type: Docs, isArray: false })
    documents: Docs

    //@ApiProperty({ type: [Teachers], isArray: true })
    //teachers: Teachers[]

}
