import { Module } from '@nestjs/common';
import { RequestModule } from '../request/request.module';
import { HomeController } from './controllers/home.controller';
import { VideoController } from './controllers/video.controller';
import { HomeService } from './providers/home.service';
import { SeleniumService } from './providers/selenium.service';
import { VideoService } from './providers/video.service';

@Module({
  imports: [RequestModule],
  providers: [SeleniumService, VideoService, HomeService],
  controllers: [HomeController, VideoController],
  exports: [SeleniumService],
})
export class SeleniumModule {}
