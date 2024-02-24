import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as exception from 'src/exception';
import * as response from 'src/common/dto';

@Injectable()
export class FnFindTeachersService {
  private logger = new Logger(FnFindTeachersService.name);

  constructor(
    @InjectModel(schemas.UniversityCourse.name)
    private readonly universityCourseModel: mongoose.Model<schemas.UniversityCourseDocument>,
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
  ) {}

  async execute(idCourse: string, userDecorator: any) {
    this.logger.debug(
      `::execute::parameters::${idCourse}::${JSON.stringify(userDecorator)}`,
    );

    const universityCourse = await this.universityCourseModel.findById(
      idCourse,
    );

    if (!universityCourse) {
      throw new exception.CourseNotFoundaCustomException(`COURSE_NOTFOUND`);
    }

    this.logger.debug(
      `::universityCourse.idUniversity::${universityCourse.idUniversity}::${userDecorator.idUniversity}`,
    );

    if (
      universityCourse.idUniversity.toString() !== userDecorator.idUniversity
    ) {
      throw new exception.UnahutorizedUniversityCustomException(
        'UNAUTHORIZED_UNIVERSITY',
      );
    }

    const idTeachers = universityCourse.teachers.map((teacher) => teacher._id);
    const universityTeachers = await this.universityTeacherModel.find({
      _id: { $in: idTeachers },
    });
    this.logger.debug(
      `::course::${universityCourse.name}::universityTeachers::${universityTeachers.length}`,
    );

    const teachersForCourse = await this.generateTeachersForCourse(
      universityCourse.id,
      universityCourse.name,
      universityTeachers,
    );

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnFindTeachersService.name}::execute`,
      data: teachersForCourse,
    };
  }

  private async generateTeachersForCourse(
    idCourse: mongoose.Types.ObjectId,
    courseName: string,
    universityTeachers: schemas.UniversityTeacherDocument[],
  ) {
    let teachersForCourse = {
      course: {
        idCourse,
        name: courseName,
      },
      teachers: [],
    };

    for (const teacher of universityTeachers) {
      const teacherAndCourse = teacher.courses.find(
        (course) => course._id.toString() === idCourse.toString(),
      );

      if (teacherAndCourse) {
        teachersForCourse.teachers.push({
          idTeacher: teacher.id,
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          photoUrl: teacher.url,
          manyAverageQualifications: teacherAndCourse.manyAverageQualifications,
          manyComments: teacherAndCourse.manyComments,
          manyQualifications: teacherAndCourse.manyQualifications,
          requiredQualifications: teacherAndCourse.requiredQualifications,
          optionalQualifications: teacherAndCourse.optionalQualifications,
        });
      }
    }

    teachersForCourse.teachers = teachersForCourse.teachers.sort(
      (a, b) => b.manyAverageQualifications - a.manyAverageQualifications,
    );

    return teachersForCourse;
  }
}
