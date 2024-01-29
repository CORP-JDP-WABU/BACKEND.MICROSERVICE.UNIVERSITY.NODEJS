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
    ]),
    CryptoModule,
  ],
  controllers: [TeacherController],
  providers: [services.FnTeacherInCourseService],
})
export class TeacherModule {}