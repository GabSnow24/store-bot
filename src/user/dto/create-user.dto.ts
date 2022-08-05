import { IsPhoneNumber, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {
  @IsString()
  readonly username: string

  @IsString()
  readonly password: string

  @IsPhoneNumber('BR')
  readonly cellphone: string
}
