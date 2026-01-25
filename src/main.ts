import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix); // optional
  app.enableCors(); // if frontend calls API

   const config = new DocumentBuilder()
    .setTitle('Nest APIs')
    .setDescription('Backend services API documentation')
    .setVersion('1.0')
    .addBearerAuth() // for JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);
  Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
}
bootstrap();

