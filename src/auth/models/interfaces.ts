import { Roles } from '@prisma/client'

export interface IRest {
  id: string
  cellphone: string
  username: string
  role: Roles
}

export interface IToken extends IJwt {
  username: string
  id: string
}

export interface IJwt {
  sub: string
  username: string
}
