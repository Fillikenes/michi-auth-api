import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { PrismaModule } from '../../shared/services/prisma/prisma.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {
  constructor(private readonly prismaService: PrismaService) {}
}
