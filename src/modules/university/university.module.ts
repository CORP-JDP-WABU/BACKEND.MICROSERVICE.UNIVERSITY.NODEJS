import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UniversityController } from './university.controller';
import * as schemas from 'src/common/schemas';
import * as services from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: schemas.Universities.name,
        schema: schemas.UniversitiesSchema,
      }
    ])
  ],
  controllers: [UniversityController],
  providers: [
    services.FnUniversityService
  ],
})
export class UniversityModule {}
