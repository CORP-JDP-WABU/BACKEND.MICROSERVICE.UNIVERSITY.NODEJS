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
    skipe: number,
    userDecoratorInterface: UserDecoratorInterface,
  ): Promise<response.ResponseGenericDto> {
    
    if (idUniversity != userDecoratorInterface.idUniversity) {
      throw new exception.UnahutorizedUniversityCustomException(
        `UNAUTHORIZED_UNIVERSITY`,
      );
    }

    if(search.length <= 3) {
      throw new exception.SearchMaxLengthException(
        `SEARCH_MAX_LENGTH`,
      );
    }

    search = (search == 'ALL') ? '' : this.removeDiactricsEspaces(search);
    this.logger.debug(`::execute::parameters::${search}`);

    const countCoursePromise = this.universityCourseModel
      .countDocuments({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        searchText: { $regex: search, $options: 'mi' }
      });

    const universityCoursePromise = this.universityCourseModel
      .find({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        searchText: { $regex: search, $options: 'mi' }
      }, {
        _id: 1, name: 1, teachers: 1
      })
      .skip( skipe > 0 ? ( ( skipe - 1 ) * 10 ) : 0 )
      .limit(10)



    const countTeacherPromise = this.universityTeacherModel
      .countDocuments({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        searchText: { $regex: search, $options: 'mi' } 
      })

      const universityTeacherPromise = this.universityTeacherModel
      .find({
        idUniversity: mongoose.Types.ObjectId(idUniversity),
        searchText: { $regex: search, $options: 'mi' } 
      }, {
        _id: 1, firstName: 1, lastName: 1, url: 1, courses: 1
      })
      .skip( skipe > 0 ? ( ( skipe - 1 ) * 10 ) : 0 )
      .limit(10)

    const [universityCourse, countCourse, universityTeacher, countTeacher] = await Promise.all([
      universityCoursePromise,
      countCoursePromise,
      universityTeacherPromise,
      countTeacherPromise
    ]);

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnUniversityCourseTeacherService.name}::execute`,
      data: {
        course: universityCourse.map(course => {
          return {
            idCourse: course.id,
            name: course.name,
            countTeachers: course.teachers.length
          }
        }),
        totalCourse: countCourse,
        teacher: universityTeacher.map(teacher => {

          const manyComments = this.sumProperty(teacher.courses, 'manyComments');
          const manyAverageAllQualifications = this.sumProperty(teacher.courses, 'manyAverageQualifications');
          const manyAllQualifications = this.sumProperty(teacher.courses, 'manyQualifications');
          const manyQualifications = manyAverageAllQualifications / manyAllQualifications;

          return {
            idTeacher: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            manyComments,
            manyQualifications : Number.isNaN(manyQualifications) ? 0 : manyQualifications,
            manyAllQualifications: Number.isNaN(manyAllQualifications) ? 0 : manyAllQualifications,
            photoUrl: teacher.url
          }
        }),
        totalTeacher: countTeacher,
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

  private sumProperty(arr, prop) {
    return arr.reduce((previous, current) => previous + current[prop], 0);
  }
}
