import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { UserParams } from './params/user.params';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(user: UserParams): Promise<User> {
    return this.prismaService.user.create({
      data: user,
    });
  }
}
