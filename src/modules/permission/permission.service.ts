import { Permission } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createPermission(name: string): Promise<Permission> {
    return this.prismaService.permission.create({
      data: { name },
    });
  }

  public async updatePermission(id: string, name: string): Promise<Permission> {
    return this.prismaService.permission.update({
      where: { id },
      data: { name },
    });
  }

  public async deletePermission(id: string): Promise<Permission> {
    return this.prismaService.permission.delete({
      where: { id },
    });
  }

  public async getPermissionById(id: string): Promise<Permission> {
    return this.prismaService.permission.findFirst({
      where: { id },
    });
  }
}
