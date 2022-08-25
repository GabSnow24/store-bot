import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from '../prisma/prisma.service'
import { JwtStrategy } from '../auth/jwt.strategy'
import { PromService } from '@digikare/nestjs-prom'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WPP_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL as string],
          queue: 'wpp_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy, PromService]
})
export class UserModule {}
