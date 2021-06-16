import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdvancedSearchDto } from '../dto/advanced-search.dto';
import { SimpleSearchDto } from '../dto/simple-search.dto';
import { SearchService } from '../providers/search.service';

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

  @Post('advanced')
  advanced(@Body() input: AdvancedSearchDto) {
    return this.searchService.advanced(input);
  }
}
