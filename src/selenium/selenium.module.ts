import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VideoController } from './controllers/video.controller';
import { SeleniumService } from './providers/selenium.service';
import { VideoService } from './providers/video.service';
import { SearchService } from './providers/search.service';
import { SearchController } from './controllers/search.controller';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('cache.ttl'),
        max: configService.get('cache.max'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SeleniumService, VideoService, SearchService],
  controllers: [VideoController, SearchController],
  exports: [SeleniumService],
})
export class SeleniumModule {}
