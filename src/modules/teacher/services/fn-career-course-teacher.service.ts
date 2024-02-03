import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';

@Injectable()
export class FnCareerCourseTeacherService {
  private logger = new Logger(FnCareerCourseTeacherService.name);

  constructor(
    @InjectModel(schemas.CareerCourseTeacher.name)
    private readonly careerCourseTeacherModel: mongoose.Model<schemas.CareerCourseTeacherDocument>,
  ) {}

  async execute(idCareer: string, userDecorator: any) {
    const { idUniversity, idStudent } = userDecorator;

    const careerTeacherCourse = await this.careerCourseTeacherModel.findOne({
      idUniversity: new mongoose.Types.ObjectId(idUniversity),
      idCareer: new mongoose.Types.ObjectId(idCareer),
      idStudent: new mongoose.Types.ObjectId(idStudent),
    });

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnCareerCourseTeacherService.name}::execute`,
      data: !careerTeacherCourse
        ? []
        : this.shuffle(careerTeacherCourse.pendingToQualification),
    };
  }

  private shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
