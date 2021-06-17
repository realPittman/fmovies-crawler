import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { SeleniumModule } from '../selenium/selenium.module';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [RequestModule, SeleniumModule],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
