import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: '*',
    allowedHeaders: '*',
    Credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,               // Permite transformar payloads em instâncias de classes
      whitelist: true,               // Remove propriedades que não estão no DTO
      forbidNonWhitelisted: true     // Retorna erro se propriedades extras forem passadas
    }),
  );

  await app.listen(3000);
}
bootstrap();
