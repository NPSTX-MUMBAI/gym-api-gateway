import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule,{cors:true});
//   await app.listen(4444)
//   await app.enableCors();

// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
 
  app.enableCors({
    origin: "*",
    // allowedHeaders: '[]',
    credentials: true,
    methods:['POST','GET','PATCH','PUT','DELETE']
  })

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
