import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { UserCreateParams, UserUpdateParams } from './params';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(user: UserCreateParams): Promise<User> {
    return this.prismaService.user.create({
      data: user,
    });
  }

  public async updateUser(id: string, user: UserUpdateParams): Promise<User> {
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
}
