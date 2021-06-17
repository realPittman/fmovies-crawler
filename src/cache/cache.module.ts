import {
  CacheModule as nestJSCacheModule,
  Global,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    nestJSCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Redis driver
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get<number>('redis.port'),

        ttl: configService.get('cache.ttl'),
        max: configService.get('cache.max'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [nestJSCacheModule],
})
export class CacheModule {}
