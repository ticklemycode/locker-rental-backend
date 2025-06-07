import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const { email, password, ...userDetails } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new this.userModel({
      ...userDetails,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const payload = { email: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT token
    const payload = { email: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }
}
