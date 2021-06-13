import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { VideoDto } from '../dto/video.dto';
import { VideoService } from '../providers/video.service';

@Controller('video')
@UseInterceptors(CacheInterceptor)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('details')
  details(@Query() input: VideoDto) {
    return this.videoService.details(input.path);
  }

  // TODO: homepage route
}
