import { Module } from '@nestjs/common';
import { RequestModule } from '../request/request.module';
import { VideoController } from './controllers/video.controller';
import { SeleniumService } from './providers/selenium.service';
import { VideoService } from './providers/video.service';

@Module({
  imports: [RequestModule],
  providers: [SeleniumService, VideoService],
  controllers: [VideoController],
  exports: [SeleniumService],
})
export class SeleniumModule {}
