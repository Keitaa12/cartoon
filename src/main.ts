import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api');
  
  // Servir les fichiers statiques (images uploadées)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setContact(
      configService.get('DEVELOPER_NAME') ?? '',
      configService.get('DEVELOPER_PORTFOLIO') ?? '',
      configService.get('DEVELOPER_MAIL') ?? '',
    )
    .setTitle(configService.get('APP_NAME') ?? '')
    .setDescription(configService.get('APP_DESCRIPTION') ?? '')
    .setVersion(configService.get('APP_VERSION') ?? '')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(configService.get<number>('PORT', 3000));
}
bootstrap();
