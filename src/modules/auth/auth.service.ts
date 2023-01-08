import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { IRegisterParams } from './params/register-params';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  public async register(params: IRegisterParams): Promise<User> {
    const { user, auth } = params;

    return this.prismaService.user.create({
      data: {
        ...user,
        authorization: {
          create: { ...auth },
        },
      },
    });
  }
}
