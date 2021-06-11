import { Controller, Get, Query } from '@nestjs/common';
import { SeleniumService } from './selenium.service';

@Controller()
export class SeleniumController {
  constructor(private readonly seleniumService: SeleniumService) {}

  @Get()
  async getVideoDetails(@Query('path') path: string) {
    return this.seleniumService.getVideoDetails(path);
  }
}
