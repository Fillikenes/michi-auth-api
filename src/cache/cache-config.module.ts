import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    CacheModule.registerAsync<ClientOpts>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.config.redisUrl,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
})
export class CacheConfigModule {}
