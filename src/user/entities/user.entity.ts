import { Prisma, Roles } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  role: Roles
  cellphone: string
  id?: string | undefined
  username: string
  password: string
  log?: Prisma.LogUncheckedCreateNestedOneWithoutUserInput | undefined
}
