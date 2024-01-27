import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';

@Injectable()
export class FnUniversityCourseTeacherService {
  private logger = new Logger(FnUniversityCourseTeacherService.name);

  constructor(
    @InjectModel(schemas.UniversityCourse.name)
    private readonly universityCourseModel: mongoose.Model<schemas.UniversityCourseDocument>,
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
  ) {}

  async execute(idUniversity: string): Promise<response.ResponseGenericDto> {
    console.time('universityCoursePromise-universityTeacherPromise');
    const universityCoursePromise = this.universityCourseModel.find({
      idUniversity: mongoose.Types.ObjectId(idUniversity),
    });
    const universityTeacherPromise = this.universityTeacherModel.find({
      idUniversity: mongoose.Types.ObjectId(idUniversity),
    });

    const [universityCourse, universityTeacher] = await Promise.all([
      universityCoursePromise,
      universityTeacherPromise,
    ]);
    console.timeEnd('universityCoursePromise-universityTeacherPromise');

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnUniversityCourseTeacherService.name}::execute`,
      data: {
        course: universityCourse,
        teacher: universityTeacher
      },
    };

  }
}
