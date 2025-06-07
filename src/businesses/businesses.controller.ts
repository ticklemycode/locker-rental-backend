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
  Request,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessSearchDto } from '../dto/business.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('businesses')
@Controller('businesses')
@UsePipes(new ValidationPipe({ 
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  forbidNonWhitelisted: false
}))
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBusinessDto: CreateBusinessDto, @Request() req) {
    return this.businessesService.create(createBusinessDto, req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search businesses with filters' })
  @ApiResponse({ status: 200, description: 'List of businesses' })
  async search(@Query() searchDto: BusinessSearchDto) {
    return this.businessesService.search(searchDto);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find businesses near a location' })
  @ApiResponse({ status: 200, description: 'Nearby businesses' })
  findNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('maxDistance') maxDistance: number = 40000 // 40km in meters (25 miles)
  ) {
    return this.businessesService.findNearby(latitude, longitude, maxDistance);
  }

  @Get('by-zipcode/:zipCode')
  @ApiOperation({ summary: 'Find businesses by ZIP code' })
  @ApiResponse({ status: 200, description: 'Businesses in ZIP code area' })
  findByZipCode(@Param('zipCode') zipCode: string) {
    return this.businessesService.findByZipCode(zipCode);
  }

  @Get()
  @ApiOperation({ summary: 'List all businesses' })
  @ApiResponse({ status: 200, description: 'List of all businesses' })
  async findAll() {
    return this.businessesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business by ID' })
  @ApiResponse({ status: 200, description: 'Business details' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a business' })
  @ApiResponse({ status: 200, description: 'Business deleted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  remove(@Param('id') id: string) {
    return this.businessesService.remove(id);
  }
}
