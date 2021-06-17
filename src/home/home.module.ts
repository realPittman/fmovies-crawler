import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { RequestModule } from '../request/request.module';

@Module({
  imports: [RequestModule],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
