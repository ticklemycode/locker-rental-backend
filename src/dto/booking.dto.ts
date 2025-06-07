import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  businessId: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  lockerNumber: number;

  @ApiProperty({ example: '2024-06-04T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-06-04T16:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  durationHours: number;

  @ApiProperty({ example: 'Please keep my bag safe', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;
}

export class UpdateBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  lockerNumber?: number;

  @ApiProperty({ example: '2024-06-04T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ example: '2024-06-04T16:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ example: 'Please keep my bag safe', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiProperty({ example: 'confirmed', required: false })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired'])
  status?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ example: 'confirmed' })
  @IsNotEmpty()
  @IsEnum(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired'])
  status: string;

  @ApiProperty({ example: 'Customer requested cancellation', required: false })
  @IsOptional()
  @IsString()
  cancellationReason?: string;
}

export class CheckInDto {
  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  accessCode: string;
}

export class BookingSearchDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011', required: false })
  @IsOptional()
  @IsString()
  businessId?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired'])
  status?: string;

  @ApiProperty({ example: '2024-06-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-06-30', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
