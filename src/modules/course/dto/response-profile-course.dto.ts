import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

class Teachers {

}

class Docs {
    @ApiProperty()
    documentType: string;

    @ApiProperty()
    quantity: number;
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
    
    @ApiProperty({ type: [Docs], isArray: true })
    documents: Docs[]

    //@ApiProperty({ type: [Teachers], isArray: true })
    //teachers: Teachers[]

}
