import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './shared/services/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UserModule,
    PermissionModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
