import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as exception from 'src/exception';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';
import * as dto from '../dto';

@Injectable()
export class FnCareerCourseTeacherService {
 
    private logger = new Logger(FnCareerCourseTeacherService.name);

    constructor(
    @InjectModel(schemas.CareerCourseTeacher.name)
    private readonly careerCourseTeacherModel: mongoose.Model<schemas.CareerCourseTeacherDocument>,
  ) {}

  async execute(
    idCareer: string,
    userDecorator: any,
  ) {

    const careerTeacherCourse = await this.careerCourseTeacherModel.find({ idCareer: new mongoose.Types.ObjectId(idCareer) });

    const response: dto.ResponseCareerTeacherCourseDto[] = careerTeacherCourse.map(x => {
      return <dto.ResponseCareerTeacherCourseDto> {
        idCourse: x.course._id.toString(),
        courseName: x.course.name,
        teacherFirstName: x.teacher.firstName,
        teacherLastName: x.teacher.lastName,
        idTeacher: x.teacher._id.toString(),
        teacherPhotoUrl: x.teacher.photoUrl
      }
    })

    return <response.ResponseGenericDto>{
        message: 'Processo exitoso',
        operation: `::${FnCareerCourseTeacherService.name}::execute`,
        data: response
    };
  }
}
