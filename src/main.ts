import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3002;
  
  // Enable CORS for React Native app
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    validateCustomDecorators: true,
    transformOptions: { enableImplicitConversion: true },
    validationError: { target: false, value: false },
    stopAtFirstError: true,
    errorHttpStatusCode: 400,
  }));

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Locker Rental API')
    .setDescription('API for the Atlanta Locker Rental Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`🚀 Application is running on: http://localhost:3002`);
  console.log(`📚 API Documentation: http://localhost:3002/api/docs`);
}
bootstrap();
