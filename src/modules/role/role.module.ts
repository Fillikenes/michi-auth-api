import { Module } from '@nestjs/common';
import { PrismaModule } from '../../shared/services/prisma/prisma.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
