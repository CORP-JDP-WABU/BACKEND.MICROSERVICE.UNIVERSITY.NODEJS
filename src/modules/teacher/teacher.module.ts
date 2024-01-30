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
        name: schemas.TeacherCourseComments.name,
        schema: schemas.TeacherCourseCommentsSchema,
      },
    ]),
    CryptoModule,
  ],
  controllers: [TeacherController],
  providers: [services.FnTeacherInCourseService, services.FnTeacherCourseCommentService],
})
export class TeacherModule {}
