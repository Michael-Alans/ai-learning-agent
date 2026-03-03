import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS BEFORE listening
  app.enableCors({
    origin: "https://ai-learning-agent-cayg.onrender.com",  
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Server running on port ${port}`);
}

bootstrap();