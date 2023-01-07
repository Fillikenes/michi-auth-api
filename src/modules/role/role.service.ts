import { Role } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma/prisma.service';
import { RoleCreateParams } from './params/role-create.params';
import { RoleUpdateParams } from './params/role-update.params';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createRole(role: RoleCreateParams): Promise<Role> {
    return this.prismaService.role.create({
      data: role,
    });
  }

  public async updateRole(id: string, role: RoleUpdateParams): Promise<Role> {
    return this.prismaService.role.update({
      where: { id },
      data: role,
    });
  }

  public async deleteRole(id: string): Promise<Role> {
    return this.prismaService.role.delete({
      where: { id },
    });
  }

  public async getRoleById(id: string): Promise<Role> {
    return this.prismaService.role.findFirst({
      where: { id },
      include: { permissions: true },
    });
  }
}
