import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeleniumController } from './selenium.controller';
import { SeleniumService } from './selenium.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('cache.ttl'),
        max: configService.get('cache.max'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SeleniumService],
  controllers: [SeleniumController],
  exports: [SeleniumService],
})
export class SeleniumModule {}
