import { Controller, Get, Query } from '@nestjs/common';
import { SeleniumService } from './selenium.service';

@Controller()
export class SeleniumController {
  constructor(private readonly seleniumService: SeleniumService) {}
  @Get('simple-search')
  // TODO: validate input
  simpleSearch(@Query('keyword') keyword: string) {
    return this.seleniumService.simpleSearch(keyword);
  }

  @Get('search')
  // TODO: validate input
  search() {
    return this.seleniumService.search();
  }

  @Get('video')
  getVideoDetails(@Query('path') path: string) {
    return this.seleniumService.getVideoDetails(path);
  }
}
