import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // optional
  app.enableCors(); // if frontend calls API

  await app.listen(3000);
}
bootstrap();

