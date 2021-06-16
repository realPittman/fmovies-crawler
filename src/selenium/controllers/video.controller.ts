import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VideoDetailsDto } from '../dto/video-details.dto';
import { VideoDto } from '../dto/video.dto';
import { VideoService } from '../providers/video.service';

@ApiTags('Video')
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
