import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, BookingSearchDto } from '../dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Locker not available' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings with optional filters' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  findAll(@Query() searchDto: BookingSearchDto) {
    return this.bookingsService.findAll(searchDto);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiResponse({ status: 200, description: 'User bookings' })
  findMyBookings(@Request() req) {
    return this.bookingsService.findByUser(req.user.userId);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'Get bookings for a specific business' })
  @ApiResponse({ status: 200, description: 'Business bookings' })
  findByBusiness(@Param('businessId') businessId: string) {
    return this.bookingsService.findByBusiness(businessId);
  }

  @Get('available-lockers/:businessId')
  @ApiOperation({ summary: 'Get available lockers for a time period' })
  @ApiResponse({ status: 200, description: 'Available locker numbers' })
  getAvailableLockers(
    @Param('businessId') businessId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string
  ) {
    return this.bookingsService.getAvailableLockers(businessId, startTime, endTime);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Cannot cancel booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookingsService.cancel(id, req.user.userId);
  }
}
