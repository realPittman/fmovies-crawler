import {
  CacheInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { HomeService } from '../providers/home.service';

@Controller('home')
@UseInterceptors(CacheInterceptor)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  homepage() {
    return this.homeService.homepage();
  }
}
