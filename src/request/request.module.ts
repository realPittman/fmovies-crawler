import { HttpModule, Module } from '@nestjs/common';
import { RequestService } from './request.service';

@Module({
  imports: [HttpModule],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
