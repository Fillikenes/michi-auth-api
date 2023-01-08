import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { IUserCreateParams, IUserUpdateParams } from './params';
import { UserWithAuthorization } from './models/user-authorization.model';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(user: IUserCreateParams): Promise<User> {
    return this.prismaService.user.create({
      data: user,
    });
  }

  public async updateUser(id: string, user: IUserUpdateParams): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: user,
    });
  }

  public async deleteUser(id: string): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  public async getUserByRut(rut: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: { rut },
    });
  }

  public async getUserByEmail(email: string): Promise<UserWithAuthorization> {
    return this.prismaService.user.findFirst({
      where: { email },
      include: { authorization: true },
    });
  }
}
