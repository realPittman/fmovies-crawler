import { Module } from '@nestjs/common';
import { SeleniumModule } from './selenium/selenium.module';

@Module({
  imports: [SeleniumModule],
})
export class AppModule {}
