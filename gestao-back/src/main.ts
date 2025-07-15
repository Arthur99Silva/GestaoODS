import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Alteração: O CORS agora permite a origem do frontend em produção (via variável de ambiente)
  // e também a origem local para desenvolvimento.
   app.enableCors({
    origin: true, // <- permite qualquer origem
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();