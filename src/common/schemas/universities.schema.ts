import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from './audit-properties.schema';

export type UniversitiesDocument = Universities & mongoose.Document;

@Schema({ collection: 'Universities', autoIndex: true })
export class Universities {

  @Prop({})
  name: string;

  @Prop(raw({ 
    type: [{
      idCareer: mongoose.Types.ObjectId, 
      name: String
  }] 
  }))
  careers: [{ idCareer: mongoose.Types.ObjectId; name: string }];

  @Prop({ type: AuditPropertiesSchema })
  auditProperties: AuditPropertiesSchema;
}

export const UniversitiesSchema = SchemaFactory.createForClass(Universities);
