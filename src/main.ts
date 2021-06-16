import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('fmovies-crawler')
    .setDescription('The fmovies-crawler API description')
    .setVersion('0.0.1')
    .setLicense(
      'MIT',
      'https://github.com/Scrip7/fmovies-crawler/blob/main/LICENSE',
    )
    .setExternalDoc(
      'GitHub repository',
      'https://github.com/Scrip7/fmovies-crawler',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);

  await app.listen(
    configService.get('port'),
    configService.get('isDocker') ? '0.0.0.0' : undefined,
  );

  logger.log(`Application is listening`);
}
bootstrap();
