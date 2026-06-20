import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  console.log('1');
  const app = await NestFactory.create(AppModule);
  console.log('2');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://blog-michoo.vercel.app',
    ],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const port = Number(process.env.PORT) || 4000;
  console.log('3', port);

  console.log('process.env.PORT =', process.env.PORT);
  console.log('process.env =', Object.keys(process.env));

  console.log('PORT =', port);

  await app.listen(port, '0.0.0.0');
  console.log('4');

  console.log(`Server running on ${port}`);
}

bootstrap()