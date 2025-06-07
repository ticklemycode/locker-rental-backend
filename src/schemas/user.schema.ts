import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: 'user' })
  role: string; // 'user' | 'business' | 'admin'

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
