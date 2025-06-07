import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BusinessDocument = Business & Document;

interface Location {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

@Schema({ timestamps: true })
export class Business {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  businessType: string; // 'restaurant' | 'grocery' | 'cafe' | 'other'

  @Prop({ 
    type: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    required: true 
  })
  address: Address;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  })
  location: Location;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ required: true, min: 1 })
  totalLockers: number;

  @Prop({ default: 0 })
  availableLockers: number;

  @Prop({ required: true, min: 0 })
  pricePerHour: number;

  @Prop({ type: [String] })
  amenities: string[]; // ['wifi', 'restroom', 'parking', 'food', 'drinks']

  @Prop({ 
    type: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    }
  })
  operatingHours: any;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

// Add 2dsphere index for location-based queries
BusinessSchema.index({ location: '2dsphere' });
BusinessSchema.index({ businessType: 1 });
BusinessSchema.index({ 'address.zipCode': 1 });
BusinessSchema.index({ name: 'text' });
