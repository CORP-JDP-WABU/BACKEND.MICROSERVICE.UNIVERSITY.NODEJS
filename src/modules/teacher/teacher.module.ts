import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as schemas from 'src/common/schemas';
import * as services from './services';
import { CryptoModule } from 'src/common/crypto/crypto.module';
import { TeacherController } from './teacher.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: schemas.UniversityTeacher.name,
        schema: schemas.UniversityTeacherSchema,
      },
      {
        name: schemas.UniversityCourse.name,
        schema: schemas.UniversityCourseSchema
      },
      {
        name: schemas.TeacherCourseComments.name,
        schema: schemas.TeacherCourseCommentsSchema,
      },
      {
        name: schemas.CareerCourseTeacher.name,
        schema: schemas.CareerCourseTeacherSchema,
      },
    ]),
    CryptoModule,
  ],
  controllers: [TeacherController],
  providers: [
    services.FnTeacherInCourseService,
    services.FnTeacherAllCoursesService,
    services.FnTeacherCourseCommentService,
    services.FnCareerCourseTeacherService,
  ],
})
export class TeacherModule {}
