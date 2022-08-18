import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { PromModule } from '@digikare/nestjs-prom'
import { AuthModule } from './auth/auth.module'
import { LoggingModule } from './common/logging.module'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

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
      }
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
