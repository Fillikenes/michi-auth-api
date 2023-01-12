import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Put('/:id')
  public async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, user);
  }

  @Delete('/:id')
  public async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:rut')
  public async getUserByRut(@Param('rut') rut: string) {
    return this.userService.getUserByRut(rut);
  }
}
