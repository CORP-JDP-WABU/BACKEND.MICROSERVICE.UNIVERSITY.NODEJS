import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from './audit-properties.schema';

export type SuggestsDocument = Suggests & mongoose.Document;

@Schema({ collection: 'Suggests', autoIndex: true })
export class Suggests {
  @Prop(
    raw({
      name: String,
      lowercaseNoSpaces: String,
      coincidences: Number,
    }),
  )
  university: {
    name: string;
    lowercaseNoSpaces: string;
    coincidences: number;
  };

  @Prop(
    raw({
      name: String,
      lowercaseNoSpaces: String,
      coincidences: Number,
    }),
  )
  teacher: {
    name: string;
    lowercaseNoSpaces: string;
    coincidences: number;
  }[];

  @Prop({
    type: AuditPropertiesSchema,
    default: () => new AuditPropertiesSchema(),
  })
  auditProperties: AuditPropertiesSchema;
}

export const SuggestsSchema = SchemaFactory.createForClass(Suggests);
