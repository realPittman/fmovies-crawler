import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VideoController } from './controllers/video.controller';
import { SeleniumService } from './providers/selenium.service';
import { VideoService } from './providers/video.service';
import { SearchService } from './providers/search.service';
import { SearchController } from './controllers/search.controller';
import { HomeController } from './controllers/home.controller';
import { HomeService } from './providers/home.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        // TODO: load from config
        host: 'redis',
        port: 6379,
        ttl: configService.get('cache.ttl'),
        max: configService.get('cache.max'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SeleniumService, VideoService, SearchService, HomeService],
  controllers: [VideoController, SearchController, HomeController],
  exports: [SeleniumService],
})
export class SeleniumModule {}
