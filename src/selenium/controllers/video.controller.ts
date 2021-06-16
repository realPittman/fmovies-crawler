import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { VideoDetailsDto } from '../dto/video-details.dto';
import { VideoDto } from '../dto/video.dto';
import { VideoService } from '../providers/video.service';

@Controller('video')
@UseInterceptors(CacheInterceptor)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  byId(@Query() input: VideoDto) {
    return this.videoService.findById(input.id);
  }

  @Get('details')
  details(@Query() input: VideoDetailsDto) {
    return this.videoService.details(input.path);
  }
}
