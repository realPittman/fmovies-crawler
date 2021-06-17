import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { AdvancedSearchDto } from './dto/advanced-search.dto';
import { SimpleSearchDto } from './dto/simple-search.dto';

@ApiTags('Search')
@Controller('search')
@UseInterceptors(CacheInterceptor)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('available-options')
  options() {
    return this.searchService.availableOptions();
  }

  @Get('simple')
  simple(@Query() input: SimpleSearchDto) {
    return this.searchService.simple(input.keyword);
  }

  @Get('advanced')
  advanced(@Query() input: AdvancedSearchDto) {
    return this.searchService.advanced(input);
  }
}
