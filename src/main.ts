import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import actuator from 'express-actuator'
import { INestApplication, Logger } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { DEFAULT_API_PREFIX } from './constants/default'
import { WinstonLogger } from './common/winston.logger'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { PromService } from '@digikare/nestjs-prom'
import timeout from 'connect-timeout'

const DEFAULT_API_VERSION = '1'
const DEFAULT_API_PORT = 3000
const loggerInstance = new Logger('Bootstrap')
const cronJobInstance = new SchedulerRegistry()

async function promGaugeConnections(promService: PromService, count: number) {
  promService.getGauge({ name: 'node_connections', help: 'Metric for connections on server' }).set(count)
}

async function setCronJob(app: INestApplication) {
  const server = app.getHttpServer()
  const job = new CronJob(CronExpression.EVERY_MINUTE, () => {
    const connectionCount = server.getConnections((_err: any, count: number) => {
      promGaugeConnections(new PromService(), count)
      loggerInstance.log(`There ${count} connections`)
      return count
    })
    return connectionCount
  })
  cronJobInstance.addCronJob('connectionCount', job)
  job.start()
}

function haltOnTimedout(req: { timedout: any }, _res: any, next: any) {
  if (req.timedout) {
    return new PromService()
      .getCounter({ name: 'node_timeout_connections', help: 'Metric for timeouted connections on server' })
      .inc(1)
  }
  next()
}
//TODO LATENCY INTERCEPTOR
//TODO FILTERS
//TODO CACHING SERVER
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'debug', 'log', 'warn', 'verbose'] })
  app.useLogger(app.get(WinstonLogger))
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.enableCors()
  app.use(actuator())
  app.use(timeout('1s'))
  app.use(haltOnTimedout)
  app.setGlobalPrefix(`${process.env.PREFIX || DEFAULT_API_PREFIX}/v${DEFAULT_API_VERSION}`)
  await app.listen(process.env.API_PORT || DEFAULT_API_PORT)
  loggerInstance.log(`Application is running on: ${await app.getUrl()}${process.env.PREFIX || DEFAULT_API_PREFIX}`)
  await setCronJob(app)
}
bootstrap().catch((error) => loggerInstance.error(error))
