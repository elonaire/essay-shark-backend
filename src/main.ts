import { NestFactory } from '@nestjs/core';
import { SwaggerCustomOptions, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'Essay Shark Web API',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Essay Shark Web API')
    .setDescription('Essay Shark Web API')
    .setVersion('1.0')
    // .addTag('Essay Shark Web API')
    .addBearerAuth({ in: 'header', type: 'http' }, 'Authorization')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document, customOptions);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
