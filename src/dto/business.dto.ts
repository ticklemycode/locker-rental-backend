import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, IsBoolean, IsEnum, ValidateNested, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({ example: 'Atlanta' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'GA' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: '30309' })
  @IsNotEmpty()
  @IsString()
  zipCode: string;
}

class LocationDto {
  @ApiProperty({ example: 'Point' })
  @IsString()
  type: string;

  @ApiProperty({ example: [-84.3880, 33.7490] })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class CreateBusinessDto {
  @ApiProperty({ example: 'Joe\'s Coffee Shop' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Cozy coffee shop in downtown Atlanta' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'cafe' })
  @IsNotEmpty()
  @IsEnum(['restaurant', 'grocery', 'cafe', 'other'])
  businessType: string;

  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'joe@coffeeshop.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'https://joescoffee.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalLockers: number;

  @ApiProperty({ example: 5.00 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  pricePerHour: number;

  @ApiProperty({ example: ['wifi', 'restroom', 'parking'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  operatingHours?: any;
}

export class UpdateBusinessDto {
  @ApiProperty({ example: 'Joe\'s Coffee Shop', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Cozy coffee shop in downtown Atlanta', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'cafe', required: false })
  @IsOptional()
  @IsEnum(['restaurant', 'grocery', 'cafe', 'other'])
  businessType?: string;

  @ApiProperty({ type: AddressDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiProperty({ type: LocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'joe@coffeeshop.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'https://joescoffee.com', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalLockers?: number;

  @ApiProperty({ example: 5.00, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerHour?: number;

  @ApiProperty({ example: ['wifi', 'restroom', 'parking'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  operatingHours?: any;
}

export class SearchBusinessDto {
  @ApiProperty({ example: 'Joe\'s Coffee Shop', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return undefined;
    return value;
  })
  @IsString()
  name?: string;

  @ApiProperty({ example: 33.7490, required: false, description: 'Latitude in decimal degrees' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return undefined;
    return parseFloat(value);
  })
  @IsNumber({}, { message: 'Latitude must be a valid number' })
  @Min(-90, { message: 'Latitude must be between -90 and 90 degrees' })
  @Max(90, { message: 'Latitude must be between -90 and 90 degrees' })
  latitude?: number;

  @ApiProperty({ example: -84.3880, required: false, description: 'Longitude in decimal degrees' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return undefined;
    return parseFloat(value);
  })
  @IsNumber({}, { message: 'Longitude must be a valid number' })
  @Min(-180, { message: 'Longitude must be between -180 and 180 degrees' })
  @Max(180, { message: 'Longitude must be between -180 and 180 degrees' })
  longitude?: number;

  @ApiProperty({ example: 5, required: false, description: 'Search radius in kilometers' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return undefined;
    return parseFloat(value);
  })
  @IsNumber({}, { message: 'Radius must be a valid number' })
  @Min(0.1, { message: 'Radius must be between 0.1 and 50 kilometers' })
  @Max(50, { message: 'Radius must be between 0.1 and 50 kilometers' })
  radius?: number;

  @ApiProperty({ example: '30309', required: false, description: 'US ZIP code' })
  @IsOptional()
  @IsString()
  @Length(5, 5, { message: 'ZIP code must be exactly 5 characters' })
  zipCode?: string;

  @ApiProperty({ example: 'cafe', required: false, description: 'Type of business' })
  @IsOptional()
  @IsEnum(['restaurant', 'grocery', 'cafe', 'other'], { 
    message: 'Business type must be one of: restaurant, grocery, cafe, other' 
  })
  businessType?: string;

  @ApiProperty({ example: 1, required: false, description: 'Page number for pagination' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return undefined;
    return parseInt(value, 10);
  })
  @IsNumber({}, { message: 'Page number must be a valid number' })
  @Min(1, { message: 'Page number must be at least 1' })
  page?: number;

  @ApiProperty({ example: 20, required: false, description: 'Number of results per page' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === undefined) return undefined;
    return parseInt(value, 10);
  })
  @IsNumber({}, { message: 'Limit must be a valid number' })
  @Min(1, { message: 'Limit must be between 1 and 100' })
  @Max(100, { message: 'Limit must be between 1 and 100' })
  limit?: number;
}

export class BusinessSearchDto extends SearchBusinessDto {}
