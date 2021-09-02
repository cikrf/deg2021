/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { AppModule } from './app/app.module'
import { ConfigService } from './config/config.service'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from './middlewares/http.exception.filter'

async function bootstrap() {
  const server = express()
  server.disable('x-powered-by')
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    {
      bodyParser: false,
      cors: { origin: ['*'], credentials: true },
    },
  )

  const configService = app.get(ConfigService)

  Logger.log(`Starting with parameters: ${JSON.stringify(configService.getVersionInfo(), null, 2)}`, 'Bootstrap')

  app.use(bodyParser.json({ limit: '50mb' }))
  app.enableShutdownHooks()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())

  const swaggerOptions = new DocumentBuilder()
    .setTitle('WE Decrypt service')
    .setDescription('WE Decrypt service API description')
    .setVersion(require('../package.json').version)
    .addServer(configService.getSwaggerBasePath())
    .build()

  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('/docs', app, document)

  await app.listen(configService.getPort())
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

