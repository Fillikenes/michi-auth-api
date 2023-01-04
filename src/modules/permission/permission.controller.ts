import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dtos';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  public async createPermission(@Body() { name }: CreatePermissionDto) {
    return this.permissionService.createPermission(name);
  }

  @Put('/:id')
  public async updatePermission(
    @Param('id') id: string,
    @Body() { name }: UpdatePermissionDto,
  ) {
    return this.permissionService.updatePermission(id, name);
  }

  @Delete('/:id')
  public async deletePermission(@Param('id') id: string) {
    return this.permissionService.deletePermission(id);
  }

  @Get('/:id')
  public async getPermissionById(@Param('id') id: string) {
    return this.permissionService.getPermissionById(id);
  }
}
