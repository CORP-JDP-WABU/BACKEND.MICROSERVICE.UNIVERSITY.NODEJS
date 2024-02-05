import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';
import * as exception from 'src/exception';

import { UserDecoratorInterface } from 'src/common/interfaces';

@Injectable()
export class FnUniversityCourseTeacherService {
  private logger = new Logger(FnUniversityCourseTeacherService.name);

  constructor(
    @InjectModel(schemas.UniversityCourse.name)
    private readonly universityCourseModel: mongoose.Model<schemas.UniversityCourseDocument>,
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
  ) {}

  async execute(
    idUniversity: string,
    search: string,
    userDecoratorInterface: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    if (idUniversity != userDecoratorInterface.idUniversity) {
      throw new exception.UnahutorizedUniversityCustomException(
        `UNAUTHORIZED_UNIVERSITY`,
      );
    }

    const universityCoursePromise = this.universityCourseModel
      .find({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        name: { $regex: search, $options: 'i' }
      })
    const universityTeacherPromise = this.universityTeacherModel
      .find({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ]
      })

    const [universityCourse, universityTeacher] = await Promise.all([
      universityCoursePromise,
      universityTeacherPromise,
    ]);

    this.logger.debug(`universityCoursePromise:${universityCourse.length}`);
    this.logger.debug(`universityTeacherPromise:${universityTeacher.length}`);

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnUniversityCourseTeacherService.name}::execute`,
      data: {
        course: universityCourse,
        teacher: universityTeacher,
      },
    };
  }
}
