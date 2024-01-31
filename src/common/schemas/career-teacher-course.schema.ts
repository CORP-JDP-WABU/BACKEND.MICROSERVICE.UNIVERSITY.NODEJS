import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from './audit-properties.schema';

export type CareerCourseTeacherDocument = CareerCourseTeacher &
  mongoose.Document;

@Schema({ collection: 'CareerCourseTeacher', autoIndex: true })
export class CareerCourseTeacher {
  @Prop({ type: mongoose.Types.ObjectId })
  idUniversity: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  idCareer: mongoose.Types.ObjectId;

  @Prop(
    raw({
      _id: mongoose.Types.ObjectId,
      name: String
    }),
  )
  course: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };

  @Prop(
    raw({
      _id: mongoose.Types.ObjectId,
      firstName: String,
      lastName: String,
      photoUrl: String,
    }),
  )
  teacher: {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    photoUrl: string;
  };

  @Prop({
    type: AuditPropertiesSchema,
    default: () => new AuditPropertiesSchema(),
  })
  auditProperties: AuditPropertiesSchema;
}

export const CareerCourseTeacherSchema =
  SchemaFactory.createForClass(CareerCourseTeacher);
