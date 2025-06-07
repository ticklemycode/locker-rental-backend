import { 
  Controller, 
  Get, 
  Body, 
  Patch, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService, UpdateUserDto, UpdatePasswordDto } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get current user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics including booking counts' })
  getUserStats(@Request() req) {
    return this.usersService.getUserStats(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, updateUserDto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(req.user.userId, updatePasswordDto);
  }

  @Patch('deactivate')
  @ApiOperation({ summary: 'Deactivate user account' })
  @ApiResponse({ status: 200, description: 'Account deactivated successfully' })
  deactivateAccount(@Request() req) {
    return this.usersService.deactivate(req.user.userId);
  }
}
