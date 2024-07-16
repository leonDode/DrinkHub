import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
    app.enableCors({
       origin: 'https://api-drinks-git-main-leondodes-projects.vercel.app',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

  const config = new DocumentBuilder()
    .setTitle('DrinkHub')
    .setDescription('Documentacao das Requisicoes http')
    .setVersion('1.0')
    .addTag('drinks')
    .addTag('ingredientes')
    .addTag('tags')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'DrinkHub API Documentation',
    customCssUrl: '/api/swagger-ui.css',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true 

  }))

  await app.listen(3000);
}
bootstrap();
