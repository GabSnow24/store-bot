import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import actuator from 'express-actuator'
import { Logger, RequestMethod } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { DEFAULT_API_PREFIX } from './constants/default'
import { WinstonLogger } from './common/winston.logger'

import { TimeoutInterceptor } from './common/timeout.interceptor'
import { setCronJob } from './crons/count-conn-job'

const DEFAULT_API_VERSION = '1'
const DEFAULT_API_PORT = 3000
const loggerInstance = new Logger('Bootstrap')
const options = {
  basePath: '/actuator'
}
//TODO FILTERS
//TODO CACHING SERVER
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'debug', 'log', 'warn', 'verbose'] })
  app.useLogger(app.get(WinstonLogger))
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalInterceptors(new TimeoutInterceptor())
  app.enableCors()
  app.use(actuator(options))
  app.setGlobalPrefix(`${process.env.PREFIX || DEFAULT_API_PREFIX}/v${DEFAULT_API_VERSION}`, {
    exclude: [{ path: 'metrics', method: RequestMethod.GET }]
  })
  await app.listen(process.env.API_PORT || DEFAULT_API_PORT)
  loggerInstance.log(`Application is running on: ${await app.getUrl()}${process.env.PREFIX || DEFAULT_API_PREFIX}`)
  await setCronJob(app)
}
bootstrap().catch((error) => loggerInstance.error(error))
