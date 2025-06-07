import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId;

  @Prop({ required: true })
  lockerNumber: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true, min: 1, max: 10 })
  durationHours: number;

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({ 
    required: true,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired'],
    default: 'pending'
  })
  status: string;

  @Prop()
  paymentId: string;

  @Prop({ 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  })
  paymentStatus: string;

  @Prop()
  accessCode: string; // 4-6 digit code for locker access

  @Prop()
  specialInstructions: string;

  @Prop()
  cancellationReason: string;

  @Prop({ type: Date })
  checkedInAt: Date;

  @Prop({ type: Date })
  checkedOutAt: Date;

  @Prop({ type: Date })
  cancelledAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Create indexes for efficient queries
BookingSchema.index({ userId: 1 });
BookingSchema.index({ businessId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ startTime: 1, endTime: 1 });
