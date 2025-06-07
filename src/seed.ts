import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Business } from './schemas/business.schema';
import { Booking } from './schemas/booking.schema';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const businessModel = app.get<Model<Business>>(getModelToken(Business.name));
  const bookingModel = app.get<Model<Booking>>(getModelToken(Booking.name));
  
  // Clear existing data
  await userModel.deleteMany({});
  await businessModel.deleteMany({});
  await bookingModel.deleteMany({});
  
  console.log('💾 Seeding database...');
  
  // Create test user
  const password = await bcrypt.hash('password123', 10);
  
  const testUser = await userModel.create({
    firstName: 'Test',
    lastName: 'User',
    email: 'user@example.com',
    password,
    phoneNumber: '404-555-1234',
    role: 'user',
    isActive: true
  });
  
  const businessOwner = await userModel.create({
    firstName: 'Business',
    lastName: 'Owner',
    email: 'owner@example.com',
    password,
    phoneNumber: '404-555-5678',
    role: 'business',
    isActive: true
  });
  
  const admin = await userModel.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password,
    phoneNumber: '404-555-9012',
    role: 'admin',
    isActive: true
  });
  
  console.log('✅ Created test users');
  
  // Create test businesses
  const business1 = await businessModel.create({
    name: 'Ponce City Market',
    description: 'Popular food hall and shopping center in the Old Fourth Ward',
    businessType: 'restaurant',
    address: {
      street: '675 Ponce De Leon Ave NE',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30308',
    },
    location: {
      type: 'Point',
      coordinates: [-84.3666, 33.7723], // [longitude, latitude] format for MongoDB - verified with Google Maps
    },
    images: ['https://example.com/ponce1.jpg', 'https://example.com/ponce2.jpg'],
    operatingHours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '12:00', close: '18:00' },
    },
    phoneNumber: '404-900-7900',
    website: 'https://www.poncecitymarket.com',
    ownerId: businessOwner._id,
    totalLockers: 5,
    availableLockers: 5,
    pricePerHour: 3.99,
    amenities: ['wifi', 'restroom', 'food', 'drinks', 'parking'],
    isActive: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 120
  });
  
  const business2 = await businessModel.create({
    name: 'Krog Street Market',
    description: 'Food hall and marketplace in Inman Park',
    businessType: 'restaurant',
    address: {
      street: '99 Krog St NE',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30307',
    },
    location: {
      type: 'Point',
      coordinates: [-84.3645, 33.7530], // [longitude, latitude] format for MongoDB - verified with Google Maps
    },
    images: ['https://example.com/krog1.jpg', 'https://example.com/krog2.jpg'],
    operatingHours: {
      monday: { open: '11:00', close: '20:00' },
      tuesday: { open: '11:00', close: '20:00' },
      wednesday: { open: '11:00', close: '20:00' },
      thursday: { open: '11:00', close: '20:00' },
      friday: { open: '11:00', close: '21:00' },
      saturday: { open: '11:00', close: '21:00' },
      sunday: { open: '12:00', close: '20:00' },
    },
    phoneNumber: '404-555-1212',
    website: 'https://www.krogstreetmarket.com',
    ownerId: businessOwner._id,
    totalLockers: 5,
    availableLockers: 5,
    pricePerHour: 2.99,
    amenities: ['wifi', 'restroom', 'food', 'drinks'],
    isActive: true,
    isVerified: true,
    rating: 4.6,
    reviewCount: 87
  });
  
  const business3 = await businessModel.create({
    name: 'The Battery Atlanta',
    description: 'Live-work-play destination adjacent to Truist Park',
    businessType: 'other',
    address: {
      street: '800 Battery Ave SE',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30339',
    },
    location: {
      type: 'Point',
      coordinates: [-84.4683, 33.8880], // [longitude, latitude] format for MongoDB - verified with Google Maps
    },
    images: ['https://example.com/battery1.jpg', 'https://example.com/battery2.jpg'],
    operatingHours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '22:00' },
      saturday: { open: '10:00', close: '22:00' },
      sunday: { open: '12:00', close: '19:00' },
    },
    phoneNumber: '404-555-1313',
    website: 'https://www.batteryatl.com',
    ownerId: businessOwner._id,
    totalLockers: 5,
    availableLockers: 5,
    pricePerHour: 4.99,
    amenities: ['wifi', 'restroom', 'parking', 'shopping'],
    isActive: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 156
  });
  
  // Add ADP office in Alpharetta
  const business4 = await businessModel.create({
    name: 'ADP Alpharetta Office',
    description: 'ADP corporate office with locker facilities for employees and visitors',
    businessType: 'office',
    address: {
      street: '5800 Windward Pkwy',
      city: 'Alpharetta',
      state: 'GA',
      zipCode: '30005',
    },
    location: {
      type: 'Point',
      coordinates: [-84.2921, 34.0696], // [longitude, latitude] for ADP Alpharetta office
    },
    images: ['https://example.com/adp1.jpg', 'https://example.com/adp2.jpg'],
    operatingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '17:00' },
      saturday: { open: 'closed', close: 'closed' },
      sunday: { open: 'closed', close: 'closed' },
    },
    phoneNumber: '678-582-1000',
    website: 'https://www.adp.com',
    ownerId: businessOwner._id,
    totalLockers: 10,
    availableLockers: 10,
    pricePerHour: 2.50,
    amenities: ['wifi', 'restroom', 'parking', 'security'],
    isActive: true,
    isVerified: true,
    rating: 4.5,
    reviewCount: 45
  });
  
  console.log('✅ Created test businesses');
  
  // Create a sample booking
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 5 * 60 * 60 * 1000); // 5 hours later
  
  await bookingModel.create({
    userId: testUser._id,
    businessId: business1._id,
    lockerNumber: 'A1',
    startTime,
    endTime,
    durationHours: 5,
    totalAmount: 15.00,
    status: 'active',
    paymentStatus: 'completed',
  });
  
  // Create a completed booking in the past
  const pastStartTime = new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)); // 2 days ago
  const pastEndTime = new Date(pastStartTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
  
  await bookingModel.create({
    userId: testUser._id,
    businessId: business2._id,
    lockerNumber: '101',
    startTime: pastStartTime,
    endTime: pastEndTime,
    durationHours: 4,
    totalAmount: 12.00,
    status: 'completed',
    paymentStatus: 'completed',
  });
  
  console.log('✅ Created sample bookings');
  
  console.log('✅ Database seeded successfully');
  
  await app.close();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  });
