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

    search = (search == 'ALL') ? '' : this.removeDiactricsEspaces(search);
    this.logger.debug(`::execute::parameters::${search}`);

    const universityCoursePromise = this.universityCourseModel
      .find({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        searchText: { $regex: search, $options: 'mi' }
      })
    const universityTeacherPromise = this.universityTeacherModel
      .find({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        searchText: { $regex: search, $options: 'mi' } 
      })

    const [universityCourse, universityTeacher] = await Promise.all([
      universityCoursePromise,
      universityTeacherPromise,
    ]);

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnUniversityCourseTeacherService.name}::execute`,
      data: {
        course: universityCourse,
        teacher: universityTeacher,
      },
    };
  }

  private removeDiactricsEspaces(value: string) : string {
    return value
        .normalize('NFD')
        .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
        .normalize()
        .toLowerCase()
        .replace(/ /g, "");
  } 
}
