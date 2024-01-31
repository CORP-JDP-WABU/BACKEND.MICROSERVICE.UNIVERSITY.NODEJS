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
    
    const { idUniversity, idStudent } = userDecorator;

    const careerTeacherCourse = await this.careerCourseTeacherModel.findOne({
      idUniversity: new mongoose.Types.ObjectId(idUniversity),
      idCareer: new mongoose.Types.ObjectId(idCareer),
      idStudent: new mongoose.Types.ObjectId(idStudent)
    });

    return <response.ResponseGenericDto>{
        message: 'Processo exitoso',
        operation: `::${FnCareerCourseTeacherService.name}::execute`,
        data: (!careerTeacherCourse) ? [] : careerTeacherCourse.pendingToQualification
    };
  }
}
