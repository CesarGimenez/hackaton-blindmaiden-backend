import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Goal extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  user: string;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
