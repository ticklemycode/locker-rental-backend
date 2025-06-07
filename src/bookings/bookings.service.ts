import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { CreateBookingDto, UpdateBookingDto, BookingSearchDto } from '../dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const { businessId, lockerNumber, startTime, endTime } = createBookingDto;

    // Check if the locker is available for the requested time
    const conflictingBooking = await this.bookingModel.findOne({
      businessId,
      lockerNumber,
      status: { $in: ['active', 'confirmed'] },
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gte: startTime }
        },
        {
          startTime: { $lte: endTime },
          endTime: { $gte: endTime }
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });

    if (conflictingBooking) {
      throw new ConflictException('Locker is not available for the requested time');
    }

    // Check if rental duration exceeds 10 hours
    const durationHours = (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60 * 60);
    if (durationHours > 10) {
      throw new BadRequestException('Maximum rental duration is 10 hours');
    }

    const booking = new this.bookingModel({
      ...createBookingDto,
      userId,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return booking.save();
  }

  async findAll(searchDto?: BookingSearchDto): Promise<Booking[]> {
    const query: any = {};
    
    if (searchDto?.userId) {
      query.userId = searchDto.userId;
    }
    
    if (searchDto?.businessId) {
      query.businessId = searchDto.businessId;
    }
    
    if (searchDto?.status) {
      query.status = searchDto.status;
    }

    if (searchDto?.startDate && searchDto?.endDate) {
      query.startTime = {
        $gte: new Date(searchDto.startDate),
        $lte: new Date(searchDto.endDate)
      };
    }

    return this.bookingModel
      .find(query)
      .populate('businessId', 'name address phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('businessId', 'name address phone email')
      .exec();
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    
    return booking;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ userId })
      .populate('businessId', 'name address phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByBusiness(businessId: string): Promise<Booking[]> {
    return this.bookingModel
      .find({ businessId })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Prevent updating confirmed/active bookings to avoid conflicts
    if (booking.status === 'active' && updateBookingDto.status && updateBookingDto.status !== 'completed') {
      throw new BadRequestException('Cannot modify active booking');
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(
        id,
        { ...updateBookingDto, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .populate('businessId', 'name address phone')
      .exec();

    if (!updatedBooking) {
      throw new NotFoundException('Booking not found');
    }

    return updatedBooking as unknown as Booking;
  }

  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId.toString() !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new BadRequestException('Cannot cancel completed or already cancelled booking');
    }

    // Check if booking is within 1 hour of start time
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const timeDifference = startTime.getTime() - now.getTime();
    const hoursUntilStart = timeDifference / (1000 * 60 * 60);

    if (hoursUntilStart < 1) {
      throw new BadRequestException('Cannot cancel booking within 1 hour of start time');
    }

    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(
        id,
        { status: 'cancelled', updatedAt: new Date() },
        { new: true }
      )
      .populate('businessId', 'name address phone')
      .exec();
      
    if (!updatedBooking) {
      throw new NotFoundException('Booking not found after update');
    }
    
    return updatedBooking as unknown as Booking;
  }

  async getAvailableLockers(businessId: string, startTime: string, endTime: string): Promise<number[]> {
    // This would typically get total lockers from business collection
    // For now, assume each business has lockers 1-20
    const totalLockers = Array.from({ length: 20 }, (_, i) => i + 1);

    const bookedLockers = await this.bookingModel
      .find({
        businessId,
        status: { $in: ['active', 'confirmed'] },
        $or: [
          {
            startTime: { $lte: new Date(startTime) },
            endTime: { $gte: new Date(startTime) }
          },
          {
            startTime: { $lte: new Date(endTime) },
            endTime: { $gte: new Date(endTime) }
          },
          {
            startTime: { $gte: new Date(startTime) },
            endTime: { $lte: new Date(endTime) }
          }
        ]
      })
      .distinct('lockerNumber')
      .exec();

    return totalLockers.filter(locker => !bookedLockers.map(Number).includes(locker));
  }

  async checkExpiredBookings(): Promise<void> {
    const now = new Date();
    
    // Mark bookings as completed if end time has passed
    await this.bookingModel.updateMany(
      {
        endTime: { $lt: now },
        status: 'active'
      },
      {
        status: 'completed',
        updatedAt: now
      }
    );

    // Cancel unconfirmed bookings older than 15 minutes
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    await this.bookingModel.updateMany(
      {
        createdAt: { $lt: fifteenMinutesAgo },
        status: 'pending'
      },
      {
        status: 'cancelled',
        updatedAt: now
      }
    );
  }
}
