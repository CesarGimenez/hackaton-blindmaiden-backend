import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Date })
  date: Date;

  @Prop({ type: String })
  time: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  patient: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  doctor: string;

  @Prop({ type: String, default: 'pending' })
  status: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
