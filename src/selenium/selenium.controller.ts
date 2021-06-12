import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SimpleSearchDto } from './dto/simple-search.dto';
import { VideoDto } from './dto/video.dto';
import { SeleniumService } from './selenium.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class SeleniumController {
  constructor(private readonly seleniumService: SeleniumService) {}

  @Get('simple-search')
  simpleSearch(@Query() input: SimpleSearchDto) {
    return this.seleniumService.simpleSearch(input.keyword);
  }

  @Get('search')
  // TODO: validate input
  search() {
    return this.seleniumService.search();
  }

  @Get('video')
  getVideoDetails(@Query() input: VideoDto) {
    return this.seleniumService.getVideoDetails(input.path);
  }
}
