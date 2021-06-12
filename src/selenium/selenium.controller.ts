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

  @Get('simple-search')
  simpleSearch(@Query() input: SimpleSearchDto) {
    return this.searchService.simpleSearch(input.keyword);
  }

  @Get('search')
  // TODO: validate input
  search() {
    return this.searchService.search();
  }

  @Get('video')
  getVideoDetails(@Query() input: VideoDto) {
    return this.videoService.getVideoDetails(input.path);
  }
}
