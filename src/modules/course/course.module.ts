import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as schemas from 'src/common/schemas';
import * as services from './services';
import { CryptoModule } from 'src/common/crypto/crypto.module';
import { CourseController } from './course.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: schemas.UniversityTeacher.name,
        schema: schemas.UniversityTeacherSchema,
      },
      {
        name: schemas.UniversityCourse.name,
        schema: schemas.UniversityCourseSchema,
      },
    ]),
    CryptoModule,
  ],
  controllers: [CourseController],
  providers: [services.FnFindTeachersService],
})
export class CourseModule {}
