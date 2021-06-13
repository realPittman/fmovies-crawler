import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AdvancedSearchDto } from '../dto/advanced-search.dto';
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

  @Post('advanced')
  advanced(@Body() input: AdvancedSearchDto) {
    return this.searchService.advanced(input);
  }
}
