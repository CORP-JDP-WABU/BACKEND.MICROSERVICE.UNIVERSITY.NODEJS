import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as exception from 'src/exception';
import * as schemas from 'src/common/schemas';
import * as response from 'src/common/dto';

@Injectable()
export class FnTeacherCourseCommentService {
  private logger = new Logger(FnTeacherCourseCommentService.name);

  constructor(
    @InjectModel(schemas.UniversityTeacher.name)
    private readonly universityTeacherModel: mongoose.Model<schemas.UniversityTeacherDocument>,
    @InjectModel(schemas.TeacherCourseComments.name)
    private readonly teacherCourseCommentModel: mongoose.Model<schemas.TeacherCourseCommentsDocument>,
  ) {}

  async execute(idTeacher: string, idCourse: string) {
    const teacher = await this.universityTeacherModel.findById(idTeacher);
    if (!teacher) {
      throw new exception.TeacherNotFoundCustomException(`NOTFOUND_TEACHER`);
    }

    const courseById = teacher.courses.find(
      (course) => course._id.toString() === idCourse,
    );
    if (courseById == null || courseById == undefined) {
      throw new exception.CourseNotFoundCustomException(
        `NOTFOUND_COURSE_TEACHER`,
      );
    }

    const teahcerCourseComment = await this.teacherCourseCommentModel.findOne({
      idUniversity: teacher.idUniversity,
      idTeacher: mongoose.Types.ObjectId(idTeacher),
      idCourse: mongoose.Types.ObjectId(idCourse),
    });

    const studentComments = teahcerCourseComment.students;

    return <response.ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnTeacherCourseCommentService.name}::execute`,
      data: {
        idUniversity: teahcerCourseComment.idUniversity,
        idTeacher: teahcerCourseComment.idTeacher,
        idCourse: teahcerCourseComment.idCourse,
        students: studentComments,
      },
    };
  }
}
