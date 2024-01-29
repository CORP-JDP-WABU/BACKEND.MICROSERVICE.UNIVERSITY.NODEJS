import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UniversityController } from './university.controller';
import * as schemas from 'src/common/schemas';
import * as services from './services';
import { CryptoModule } from 'src/common/crypto/crypto.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: schemas.Suggests.name,
        schema: schemas.SuggestsSchema,
      },
      {
        name: schemas.Universities.name,
        schema: schemas.UniversitiesSchema,
      },
      {
        name: schemas.UniversityCourse.name,
        schema: schemas.UniversityCourseSchema,
      },
      {
        name: schemas.UniversityTeacher.name,
        schema: schemas.UniversityTeacherSchema,
      },
    ]),
    CryptoModule,
  ],
  controllers: [UniversityController],
  providers: [
    services.FnUniversityService,
    services.FnUniversityCourseTeacherService,
    services.FnSuggestService,
  ],
})
export class UniversityModule {}
