import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PermissionModule } from './modules/permission/permission.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/services/prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule, UserModule, PermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
