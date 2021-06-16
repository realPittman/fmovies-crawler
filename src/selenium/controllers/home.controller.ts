import {
  CacheInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomeService } from '../providers/home.service';

@ApiTags('Home')
@Controller('home')
@UseInterceptors(CacheInterceptor)
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  homepage() {
    return this.homeService.homepage();
  }
}
