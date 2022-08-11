import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { passwordHasher } from 'src/utils/encrypt.utils'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

const userInfoReturn = {
  id: true,
  username: true,
  cellphone: true,
  role: true
}
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const { cellphone, username, password } = data
    const foundUser = await this.prisma.user.findFirst({
      where: {
        cellphone,
        username
      }
    })

    if (foundUser) {
      Logger.error('User already created', '', 'UserService', true)
      throw new ConflictException('User already created')
    }

    const { hash } = await passwordHasher(password)
    data = { ...data, role: 'USER', password: hash }

    const user = await this.prisma.user.create({
      data,
      select: {
        cellphone: true,
        username: true
      }
    })

    return user
  }

  findAll() {
    return this.prisma.user.findMany({
      select: userInfoReturn
    })
  }

  async findOne(id: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: userInfoReturn
    })
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true)
      throw new NotFoundException('User not found')
    }
    return foundUser
  }

  async findByUserName(username: string) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        username
      }
    })
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true)
      throw new NotFoundException('User not found')
    }
    return foundUser
  }

  async update(id: string, data: UpdateUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true)
      throw new NotFoundException('User not found')
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id
      },
      data,
      select: userInfoReturn
    })

    return updatedUser
  }

  async remove(id: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true)
      throw new NotFoundException('User not found')
    }
    await this.prisma.user.delete({
      where: {
        id
      }
    })
  }
}
