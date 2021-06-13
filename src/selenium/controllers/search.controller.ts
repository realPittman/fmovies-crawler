import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SimpleSearchDto } from '../dto/simple-search.dto';
import { SearchService } from '../providers/search.service';

@Controller('search')
@UseInterceptors(CacheInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('options')
  options() {
    return this.searchService.options();
  }

  @Get('simple')
  simple(@Query() input: SimpleSearchDto) {
    return this.searchService.simple(input.keyword);
  }

  @Get('advanced')
  // TODO: validate input
  advanced() {
    return this.searchService.advanced();
  }
}
