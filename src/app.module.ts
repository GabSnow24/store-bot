import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { PromModule } from '@digikare/nestjs-prom'
import { AuthModule } from './auth/auth.module'
import { LoggingModule } from './common/logging.module'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'

//IMPLEMENT RATE LIMIT
@Module({
  imports: [
    UserModule,
    LoggingModule,
    EventEmitterModule.forRoot(),
    PromModule.forRoot({
      defaultLabels: {
        app: process.env.APP_NAME || 'bot-wpp',
        version: '0.0.1'
      },
      withHttpMiddleware: {
        enable: true
      },
      metricPath: 'prometheus'
    }),
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
