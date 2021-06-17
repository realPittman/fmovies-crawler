import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { SeleniumModule } from './selenium/selenium.module';
import { RequestModule } from './request/request.module';
import { SearchModule } from './search/search.module';
import { CacheModule } from './cache/cache.module';
import { HomeModule } from './home/home.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
      isGlobal: true,
    }),
    CacheModule,
    RequestModule,
    HomeModule,
    SearchModule,
    SeleniumModule,
    VideoModule,
  ],
})
export class AppModule {}
