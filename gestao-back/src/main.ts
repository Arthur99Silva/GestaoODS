import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { AuthData } from './Auth/entity/auth-data.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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

  //Código de teste de usuário
  const repo = app.get<Repository<AuthData>>(getRepositoryToken(AuthData));

  // Checa se o usuário de teste já existe antes de criar
  const exists = await repo.findOneBy({ email: 'teste@exemplo.com' });
  if (!exists) {
    await repo.save({ email: 'teste@exemplo.com', senha: '1234' });
    console.log('Usuário de teste criado com sucesso!');
  } else {
    console.log('Usuário de teste já existe.');
  }
  //Fim de código de teste de usuário

  await app.listen(3000);
}
bootstrap();
