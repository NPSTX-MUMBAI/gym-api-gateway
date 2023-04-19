import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: "*",
  //   allowedHeaders: '[Content-Type/XML]',
  //   credentials: true,
  //   methods: "['POST']"
  // })

  await app.listen(3000);
}
bootstrap();
