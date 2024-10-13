import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: false, type: String, unique: true, sparse: true })
  email: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String, unique: true, sparse: true })
  username: string;

  @Prop({
    required: false,
    type: String,
  })
  role: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: Boolean, default: true })
  active: boolean;

  @Prop({ required: false, type: SchemaTypes.ObjectId, ref: 'User' })
  doctor?: string;

  @Prop({ required: false, type: Object })
  treatment?: any;

  @Prop({ required: false, type: Number })
  age?: number;

  @Prop({ required: false, type: String })
  gender?: string;

  @Prop({ required: false, type: String })
  phone?: string;

  @Prop({ required: false, type: Boolean, default: false })
  is_verified?: string;

  @Prop({ required: false, type: String })
  image?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next) {
  if (this.isNew) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});
