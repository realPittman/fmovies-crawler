import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SimpleSearchDto } from './dto/simple-search.dto';
import { VideoDto } from './dto/video.dto';
import { SearchService } from './providers/search.service';
import { VideoService } from './providers/video.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class SeleniumController {
  constructor(
    private readonly videoService: VideoService,
    private readonly searchService: SearchService,
  ) {}

  @Get('search/options')
  options() {
    return this.searchService.options();
  }

  @Get('search/simple')
  simple(@Query() input: SimpleSearchDto) {
    return this.searchService.simple(input.keyword);
  }

  @Get('search/advanced')
  // TODO: validate input
  advanced() {
    return this.searchService.advanced();
  }

  @Get('video')
  getVideoDetails(@Query() input: VideoDto) {
    return this.videoService.getVideoDetails(input.path);
  }

  // TODO: homepage route
}
