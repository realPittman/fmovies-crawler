import { Module } from '@nestjs/common';
import { RequestModule } from '../request/request.module';
import { SeleniumService } from './selenium.service';

@Module({
  imports: [RequestModule],
  providers: [SeleniumService],
  exports: [SeleniumService],
})
export class SeleniumModule {}
