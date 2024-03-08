import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';

@Injectable()
export class FnTeacherAllCoursesService {
  private logger = new Logger(FnTeacherAllCoursesService.name);

  constructor(
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
    @InjectModel(schemas.UniversityCourse.name)
    private readonly universityCourseModel: mongoose.Model<schemas.UniversityCourseDocument>,
  ) {}

  async execute(idTeacher: string, idCareer: string) {
    const [
      universityTeachers,
      universityCoursesInCareer,
      universityCoursesInOtherCareer,
    ] = await Promise.all([
      this.universityTeacherModel.findById(idTeacher),
      this.universityCourseModel.find({
        'teachers._id': new mongoose.Types.ObjectId(idTeacher),
        careers: { $in: [mongoose.Types.ObjectId(idCareer)] },
      }),
      this.universityCourseModel.find({
        'teachers._id': new mongoose.Types.ObjectId(idTeacher),
        careers: { $ne: [mongoose.Types.ObjectId(idCareer)] },
      }),
    ]);

    const { firstName, lastName, email, url, courses } = universityTeachers;
    this.logger.debug(`universityTeachers::courses::${JSON.stringify(courses.length)}`)

    const idCourseInCareer = universityCoursesInCareer.map((x) => x._id.toString());
    this.logger.debug(`universityTeachers::idCourseInCareer::${JSON.stringify(idCourseInCareer.length)}`)


    const idCourseInOtherCareer = universityCoursesInOtherCareer.map(
      (x) => x.id.toString(),
    );
    this.logger.debug(`universityTeachers::idCourseInOtherCareer::${JSON.stringify(idCourseInOtherCareer.length)}`)


    const courseInCareer = courses.filter((x) =>
      idCourseInCareer.includes(x._id.toString()),
    );
    const courseInOtherCareer = universityTeachers.courses.filter((x) =>
      idCourseInOtherCareer.includes(x._id.toString()),
    );

    const generateKpisToTeacher = this.generateKpisToTeacher(courses);

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnTeacherAllCoursesService.name}::execute`,
      data: {
        teacher: {
          id: idTeacher,
          photoUrl: url,
          firstName,
          lastName,
          information: '',
          email,
          ...generateKpisToTeacher,
        },
        courseInCareer: courseInCareer.map(x => {
          return {
            id: x._id,
            name: x.name,
            manyQualifications: x.manyQualifications,
            manyAverageQualifications: x.manyAverageQualifications,
            manyComments: x.manyComments
          }
        }),
        courseInOtherCareer: courseInOtherCareer.map(x => {
          return {
            id: x._id,
            name: x.name,
            manyQualifications: x.manyQualifications,
            manyAverageQualifications: x.manyAverageQualifications,
            manyComments: x.manyComments
          }
        }),
      },
    };
  }

  private generateKpisToTeacher(courses: any[]) {
    const manyQualifications = courses.reduce(
      (acumulator, real) => acumulator + real.manyQualifications,
      0,
    );
    const manyComments = courses.reduce(
      (acumulator, real) => acumulator + real.manyComments,
      0,
    );

    let averageQualifications = 0;
    let amountDivide = 0;
    for (const course of courses) {
      if(course.manyAverageQualifications > 0) {
        averageQualifications = averageQualifications + course.manyAverageQualifications;
        amountDivide++;
      }
    }
    return {
      manyQualifications,
      manyComments,
      manyAverageQualifications:
        averageQualifications == 0 ? 0 : averageQualifications / amountDivide,
    };
  }
}
