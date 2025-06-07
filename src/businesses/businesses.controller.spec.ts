import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { BusinessSearchDto } from '../dto/business.dto';

describe('BusinessesController', () => {
  let controller: BusinessesController;
  let service: BusinessesService;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessesController],
      providers: [
        {
          provide: BusinessesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            search: jest.fn(),
            findNearby: jest.fn(),
            findByZipCode: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BusinessesController>(BusinessesController);
    service = module.get<BusinessesService>(BusinessesService);
    validationPipe = new ValidationPipe({ transform: true });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should validate latitude range', async () => {
      const invalidDto = {
        latitude: '100', // Invalid: > 90
        longitude: '0'
      };
      
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'query',
          metatype: BusinessSearchDto
        })
      ).rejects.toThrow();
    });

    it('should validate longitude range', async () => {
      const invalidDto = {
        latitude: '0',
        longitude: '200' // Invalid: > 180
      };
      
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'query',
          metatype: BusinessSearchDto
        })
      ).rejects.toThrow();
    });

    it('should validate radius range', async () => {
      const invalidDto = {
        latitude: '0',
        longitude: '0',
        radius: '100' // Invalid: > 50
      };
      
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'query',
          metatype: BusinessSearchDto
        })
      ).rejects.toThrow();
    });

    it('should validate ZIP code length', async () => {
      const invalidDto = {
        zipCode: '123' // Invalid: length != 5
      };
      
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'query',
          metatype: BusinessSearchDto
        })
      ).rejects.toThrow();
    });

    it('should handle valid search by coordinates', async () => {
      const validDto = {
        latitude: '33.7490',
        longitude: '-84.3880',
        radius: '5'
      };
      
      const transformedDto = await validationPipe.transform(validDto, {
        type: 'query',
        metatype: BusinessSearchDto
      });
      
      await controller.search(transformedDto);
      expect(service.search).toHaveBeenCalledWith({
        latitude: 33.7490,
        longitude: -84.3880,
        radius: 5
      });
    });

    it('should handle valid search by ZIP code', async () => {
      const validDto = {
        zipCode: '30309'
      };
      
      const transformedDto = await validationPipe.transform(validDto, {
        type: 'query',
        metatype: BusinessSearchDto
      });
      
      await controller.search(transformedDto);
      expect(service.search).toHaveBeenCalledWith({
        zipCode: '30309'
      });
    });

    it('should handle valid pagination parameters', async () => {
      const validDto = {
        zipCode: '30309',
        page: '1',
        limit: '20'
      };
      
      const transformedDto = await validationPipe.transform(validDto, {
        type: 'query',
        metatype: BusinessSearchDto
      });
      
      await controller.search(transformedDto);
      expect(service.search).toHaveBeenCalledWith({
        zipCode: '30309',
        page: 1,
        limit: 20
      });
    });

    it('should validate page number', async () => {
      const invalidDto = {
        zipCode: '30309',
        page: '0' // Invalid: < 1
      };
      
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'query',
          metatype: BusinessSearchDto
        })
      ).rejects.toThrow();
    });

    it('should validate limit range', async () => {
      const invalidDto = {
        zipCode: '30309',
        limit: '150' // Invalid: > 100
      };
      
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'query',
          metatype: BusinessSearchDto
        })
      ).rejects.toThrow();
    });
  });
});
