import { Module } from '@nestjs/common';
import { RequestModule } from '../request/request.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [RequestModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
