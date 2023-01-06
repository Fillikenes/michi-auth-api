import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  public async createRole(@Body() role: CreateRoleDto) {
    return this.roleService.createRole(role);
  }

  @Put('/:id')
  public async updateRole(
    @Param('id') id: string,
    @Body() role: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, role);
  }

  @Delete('/:id')
  public async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Get('/:id')
  public async getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }
}
