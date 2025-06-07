import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { Business, BusinessSchema } from '../schemas/business.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }])
  ],
  providers: [BusinessesService],
  controllers: [BusinessesController],
  exports: [BusinessesService]
})
export class BusinessesModule {}
