import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from '../schemas/business.schema';
import { CreateBusinessDto, SearchBusinessDto } from '../dto/business.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, ownerId: string): Promise<Business> {
    const business = new this.businessModel({
      ...createBusinessDto,
      ownerId,
      availableLockers: createBusinessDto.totalLockers,
    });

    return business.save();
  }

  async findAll(query: any = {}): Promise<Business[]> {
    return this.businessModel
      .find({ isActive: true, ...query })
      .populate('ownerId', 'firstName lastName email')
      .exec();
  }

  async findById(id: string): Promise<Business> {
    const business = await this.businessModel
      .findById(id)
      .populate('ownerId', 'firstName lastName email')
      .exec();

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async search(searchDto: SearchBusinessDto): Promise<Business[]> {
    console.log('Search DTO:', searchDto);

    // Base query for active businesses
    const query: Record<string, any> = { isActive: true };
    
    // Use text search for name if provided
    if (searchDto.name) {
      query.$text = { $search: searchDto.name };
    }
    
    // Add ZIP code search
    if (searchDto.zipCode) {
      query['address.zipCode'] = searchDto.zipCode;
    }
    
    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    // Add business type filter with flexibility for restaurant/cafe
    if (searchDto.businessType) {
      if (searchDto.businessType === 'cafe') {
        query.businessType = { $in: ['cafe', 'restaurant'] };
      } else if (searchDto.businessType === 'restaurant') {
        query.businessType = { $in: ['restaurant', 'cafe'] };
      } else {
        query.businessType = searchDto.businessType;
      }
    }

    let businesses: Business[];
    const limit = searchDto.limit || 20;
    const skip = ((searchDto.page || 1) - 1) * limit;

    // If coordinates are provided, add geospatial search
    if (searchDto.latitude && searchDto.longitude) {
      const radius = searchDto.radius || 40; // Default 40km radius (25 miles)
      query.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [searchDto.longitude, searchDto.latitude],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    // Execute the search with all combined filters
    const findQuery = this.businessModel.find(query);

    // Add text search score sorting if doing a text search
    if (searchDto.name) {
      findQuery.sort({ score: { $meta: 'textScore' } });
    }

    businesses = await findQuery
      .limit(limit)
      .skip(skip)
      .populate('ownerId', 'firstName lastName email')
      .exec();

    return businesses;
  }

  async findNearby(latitude: number, longitude: number, radius: number = 40): Promise<Business[]> {
    return this.businessModel
      .find({
        isActive: true,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius * 1000, // Convert km to meters
          },
        },
      })
      .limit(20)
      .populate('ownerId', 'firstName lastName email')
      .exec();
  }

  async updateLockerAvailability(businessId: string, increment: number): Promise<Business> {
    const business = await this.businessModel.findById(businessId);
    
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const newAvailableLockers = business.availableLockers + increment;
    
    if (newAvailableLockers < 0 || newAvailableLockers > business.totalLockers) {
      throw new BadRequestException('Invalid locker availability update');
    }

    business.availableLockers = newAvailableLockers;
    return business.save();
  }

  async update(id: string, updateBusinessDto: Partial<CreateBusinessDto>): Promise<Business> {
    const business = await this.businessModel
      .findByIdAndUpdate(id, updateBusinessDto, { new: true })
      .populate('ownerId', 'firstName lastName email')
      .exec();

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async remove(id: string): Promise<void> {
    const result = await this.businessModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('Business not found');
    }
  }

  async findByOwner(ownerId: string): Promise<Business[]> {
    return this.businessModel
      .find({ ownerId, isActive: true })
      .exec();
  }

  async findByZipCode(zipCode: string): Promise<Business[]> {
    return this.businessModel
      .find({ 
        'address.zipCode': zipCode,
        isActive: true 
      })
      .populate('ownerId', 'firstName lastName email')
      .exec();
  }

  async findOne(id: string): Promise<Business> {
    return this.findById(id);
  }
}
