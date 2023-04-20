import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule,{cors:true});
//   await app.listen(4444)
//   await app.enableCors();

// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    allowedHeaders: '[Content-Type/XML]',
    credentials: true,
    methods: "['POST']"
  })

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
