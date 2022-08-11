import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from '../prisma/prisma.service'
import { JwtStrategy } from 'src/auth/jwt.strategy'
import { PromService } from '@digikare/nestjs-prom'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtStrategy, PromService]
})
export class UserModule {}
