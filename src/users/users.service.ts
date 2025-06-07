import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await user.save();
    return this.findById((savedUser as any)._id.toString());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { ...updateUserDto, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new ConflictException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    
    await this.userModel.findByIdAndUpdate(id, {
      password: hashedNewPassword,
      updatedAt: new Date(),
    });
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      )
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async activate(id: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { isActive: true, updatedAt: new Date() },
        { new: true }
      )
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserStats(id: string): Promise<any> {
    const user = await this.findById(id);
    
    // Get user's booking statistics
    const bookingStats = await this.userModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'userId',
          as: 'bookings'
        }
      },
      {
        $project: {
          totalBookings: { $size: '$bookings' },
          activeBookings: {
            $size: {
              $filter: {
                input: '$bookings',
                cond: { $eq: ['$$this.status', 'active'] }
              }
            }
          },
          completedBookings: {
            $size: {
              $filter: {
                input: '$bookings',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          },
          cancelledBookings: {
            $size: {
              $filter: {
                input: '$bookings',
                cond: { $eq: ['$$this.status', 'cancelled'] }
              }
            }
          }
        }
      }
    ]);

    return {
      user,
      stats: bookingStats[0] || {
        totalBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0
      }
    };
  }
}
