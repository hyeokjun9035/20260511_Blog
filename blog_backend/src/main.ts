import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

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

  const port = Number(process.env.PORT) || 4000

  console.log('process.env.PORT =', process.env.PORT)
  console.log('process.env =', Object.keys(process.env))

  console.log('PORT =', port)

  await app.listen(port, '0.0.0.0')

  console.log(`Server running on ${port}`)
}

bootstrap()