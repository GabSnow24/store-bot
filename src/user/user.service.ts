import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

async function passwordHasher(password: string) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return { hash };
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const { cellphone, name, password } = data;
    const foundUser = await this.prisma.user.findFirst({
      where: {
        cellphone,
        name,
      },
    });

    if (foundUser) {
      Logger.error('User already created', '', 'UserService', true);
      throw new ConflictException('User already created');
    }

    const { hash } = await passwordHasher(password);
    data = { ...data, role: 'USER', password: hash };

    const user = await this.prisma.user.create({
      data,
      select: {
        cellphone: true,
        name: true,
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        name: true,
        cellphone: true,
        role: true,
      },
    });
  }

  async findOne(id: string) {
    const foundUser = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        name: true,
        cellphone: true,
        role: true,
      },
    });
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true);
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async update(id: string, data: UpdateUserDto) {
    const foundUser = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        name: true,
        cellphone: true,
        role: true,
      },
    });
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true);
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return updatedUser;
  }

  async remove(id: string) {
    const foundUser = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        name: true,
        cellphone: true,
        role: true,
      },
    });
    if (!foundUser) {
      Logger.error('User not found', '', 'UserService', true);
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
