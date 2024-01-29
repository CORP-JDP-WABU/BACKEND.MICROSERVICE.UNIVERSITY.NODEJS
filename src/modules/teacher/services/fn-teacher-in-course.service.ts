import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as exception from 'src/exception';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';

@Injectable()
export class FnTeacherInCourseService {
 
    private logger = new Logger(FnTeacherInCourseService.name);

    constructor(
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
  ) {}

  async execute(
    idTeacher: string,
    idCourse: string,
    userDecorator: any,
  ) {

    const teacher = await this.universityTeacherModel.findById(idTeacher);
    if(!teacher) {
        throw new exception.TeacherNotFoundCustomException(`NOTFOUND_TEACHER`);
    }

    const courseById = teacher.courses.find(course => course._id.toString() === idCourse);
    if (courseById == null || courseById == undefined) {
        throw new exception.CourseNotFoundCustomException(`NOTFOUND_COURSE_TEACHER`);
    }

    return <response.ResponseGenericDto>{
        message: 'Processo exitoso',
        operation: `::${FnTeacherInCourseService.name}::execute`,
        data: {
          idTeacher: teacher._id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          email: teacher.email,
          profileUrl: teacher.url,
          information: '',
          course: {
            idCourse: courseById._id,
            name: courseById.name,
            manyQualifications: courseById.manyQualifications,
            manyAverageQualifications: courseById.manyAverageQualifications,
            manyComments: courseById.manyComments,
            optionalQualifications: courseById.optionalQualifications,
            requiredQualifications: courseById.requiredQualifications
          }
        },
      };
  }
}
