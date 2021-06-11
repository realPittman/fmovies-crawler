import { Module } from '@nestjs/common';
import { SeleniumController } from './selenium.controller';
import { SeleniumService } from './selenium.service';

@Module({
  providers: [SeleniumService],
  controllers: [SeleniumController],
  exports: [SeleniumService],
})
export class SeleniumModule {}
